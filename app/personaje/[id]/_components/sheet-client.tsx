'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Character, AtributoKey } from '@/types/character'
import { getCharacterById, saveCharacter, exportCharacterJSON } from '@/lib/storage'
import { getLinaje, getClase, getTrasfondo, getSkillMod, getSaveMod, buildCharacterStats, getClassTraitsForLevel, getAvailablePowers } from '@/lib/character-utils'
import { habilidades } from '@/data/habilidades'
import { getModifier, getProficiencyBonus, ATRIBUTO_NOMBRES, XP_TABLE } from '@/data/mechanics'
import { ArrowLeft, Printer, Download, Plus, Minus, Star, Lock, Check, Shield, Heart, Zap, Swords, Eye, Scroll } from 'lucide-react'

const ATTRS: AtributoKey[] = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR']
const fm = (m: number) => (m >= 0 ? `+${m}` : `${m}`)

export default function SheetClient() {
  const router = useRouter()
  const params = useParams()
  const charId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''
  const [mounted, setMounted] = useState(false)
  const [char, setChar] = useState<Character | null>(null)

  useEffect(() => {
    setMounted(true)
    if (charId) setChar(getCharacterById(charId))
  }, [charId])

  const save = (updated: Character) => { saveCharacter(updated); setChar({ ...updated }) }
  const updateField = (field: keyof Character, value: any) => { if (!char) return; save({ ...char, [field]: value, updatedAt: new Date().toISOString() }) }

  const stats = useMemo(() => char ? buildCharacterStats(char) : null, [char])
  const traits = useMemo(() => char ? getClassTraitsForLevel(char.clase, char.nivel) : [], [char])
  const powers = useMemo(() => char ? getAvailablePowers(char.linaje, char.nivel) : { pasivos: [], activos: [], apice: null, locked: [] }, [char])

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary font-display text-2xl">Cargando...</div></div>
  if (!char) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-muted-foreground">Personaje no encontrado</p>
      <button onClick={() => router.push('/')} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-display">Volver al inicio</button>
    </div>
  )

  const { linaje: ld, clase: cd, trasf: td, nivel, bc, hpMax, sdMax, ca, iniciativa, velocidad } = stats ?? {} as any
  const subData = cd?.subclases?.find?.((s: any) => s?.id === char?.subclase)

  return (
    <>
      {/* DIGITAL SHEET */}
      <div className="min-h-screen py-6 px-4 no-print">
        <div className="max-w-5xl mx-auto">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button onClick={() => router.push('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"><ArrowLeft size={16} /> Volver</button>
            <div className="flex gap-2">
              <button onClick={() => window?.print?.()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border border-border text-sm font-display hover:bg-muted transition-colors"><Printer size={16} /> Imprimir</button>
              <button onClick={() => exportCharacterJSON(char)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border border-border text-sm font-display hover:bg-muted transition-colors"><Download size={16} /> Exportar</button>
            </div>
          </div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <h1 className="font-display text-4xl font-bold text-secondary">{char?.nombre}</h1>
            <div className="greek-line w-48 mx-auto my-3" />
            <p className="text-muted-foreground">{ld?.nombre?.split?.(' — ')?.[0]} · {cd?.nombre}{subData ? ` (${subData?.nombre})` : ''} · Nivel {nivel}</p>
            <p className="text-sm text-muted-foreground">{td?.nombre} · XP: {(XP_TABLE[nivel] ?? 0).toLocaleString('es-ES')}</p>
          </motion.div>

          {/* Combat stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            <div className="stat-block">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Heart size={12} className="text-red-600" /> PG</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <button onClick={() => updateField('hpActual', Math.max(0, (char?.hpActual ?? 0) - 1))} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-destructive/20"><Minus size={12} /></button>
                <span className="font-mono text-xl font-bold w-12 text-center">{char?.hpActual ?? 0}</span>
                <button onClick={() => updateField('hpActual', Math.min(hpMax ?? 999, (char?.hpActual ?? 0) + 1))} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-primary/20"><Plus size={12} /></button>
              </div>
              <div className="text-xs text-muted-foreground">/ {hpMax}</div>
            </div>
            <div className="stat-block">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Zap size={12} className="text-primary" /> SD</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <button onClick={() => updateField('sdActual', Math.max(0, (char?.sdActual ?? 0) - 1))} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-destructive/20"><Minus size={12} /></button>
                <span className="font-mono text-xl font-bold w-12 text-center">{char?.sdActual ?? 0}</span>
                <button onClick={() => updateField('sdActual', Math.min(sdMax ?? 999, (char?.sdActual ?? 0) + 1))} className="w-6 h-6 rounded bg-muted flex items-center justify-center hover:bg-primary/20"><Plus size={12} /></button>
              </div>
              <div className="text-xs text-muted-foreground">/ {sdMax}</div>
            </div>
            <div className="stat-block"><div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Heart size={12} className="text-blue-600" /> PG Temp</div><div className="flex items-center justify-center gap-1 mt-1"><button onClick={() => updateField('hpTemp', Math.max(0, (char?.hpTemp ?? 0) - 1))} className="w-6 h-6 rounded bg-muted flex items-center justify-center"><Minus size={12} /></button><span className="font-mono text-xl font-bold w-12 text-center">{char?.hpTemp ?? 0}</span><button onClick={() => updateField('hpTemp', (char?.hpTemp ?? 0) + 1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center"><Plus size={12} /></button></div></div>
            <div className="stat-block"><div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Shield size={12} /> CA</div><div className="font-mono text-2xl font-bold mt-1">{ca ?? 10}</div></div>
            <div className="stat-block"><div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Swords size={12} /> Iniciativa</div><div className="font-mono text-2xl font-bold mt-1">{fm(iniciativa ?? 0)}</div></div>
            <div className="stat-block"><div className="text-xs text-muted-foreground">Velocidad</div><div className="font-mono text-2xl font-bold mt-1">{velocidad ?? 9}m</div><div className="text-xs text-muted-foreground">BC +{bc ?? 2}</div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Attributes */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2"><Eye size={16} /> Atributos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {ATTRS.map((a) => {
                    const val = char?.atributos?.[a] ?? 10
                    const mod = getModifier(val)
                    return (
                      <div key={a} className="stat-block">
                        <div className="text-xs text-muted-foreground">{a}</div>
                        <div className="font-mono text-2xl font-bold">{val}</div>
                        <div className={`text-sm font-mono font-semibold ${mod >= 0 ? 'text-green-700' : 'text-red-700'}`}>{fm(mod)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Saving Throws */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3">Tiradas de Salvación</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ATTRS.map((a) => {
                    const sv = getSaveMod(char, a)
                    return (
                      <div key={a} className="flex items-center gap-2 text-sm">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] ${sv?.proficient ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{sv?.proficient ? <Check size={10} /> : null}</span>
                        <span className="font-mono w-8">{fm(sv?.mod ?? 0)}</span>
                        <span className="text-muted-foreground">{ATRIBUTO_NOMBRES[a] ?? a}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3">Habilidades</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {habilidades?.map?.((h) => {
                    const prof = char?.habilidades?.includes?.(h?.id) ?? false
                    const mod = getSkillMod(char, h?.id)
                    return (
                      <div key={h?.id} className="flex items-center gap-2 text-sm py-0.5">
                        <span className={`w-3 h-3 rounded-full border ${prof ? 'border-primary bg-primary' : 'border-border'}`} />
                        <span className="font-mono w-7 text-right">{fm(mod)}</span>
                        <span className={prof ? 'font-semibold' : 'text-muted-foreground'}>{h?.nombre}</span>
                        <span className="text-xs text-muted-foreground ml-auto">({h?.atributo})</span>
                      </div>
                    )
                  }) ?? null}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Lineage Powers */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2"><Zap size={16} /> Poderes de Linaje: {ld?.nombre?.split?.(' — ')?.[0]}</h3>
                {(powers?.pasivos?.length ?? 0) > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pasivos</h4>
                    {powers?.pasivos?.map?.((p: any, i: number) => <div key={i} className="mb-2 text-sm"><span className="font-semibold">{p?.nombre}:</span> <span className="text-muted-foreground">{p?.desc}</span></div>) ?? null}
                  </div>
                )}
                {(powers?.activos?.length ?? 0) > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Activos</h4>
                    {powers?.activos?.map?.((p: any, i: number) => <div key={i} className="mb-2 text-sm"><span className="font-semibold">{p?.nombre}</span> <span className="text-xs text-primary">({p?.costeSd} SD)</span><br/><span className="text-muted-foreground">{p?.desc}</span></div>) ?? null}
                  </div>
                )}
                {powers?.apice && (
                  <div className="mb-3 p-3 bg-primary/5 rounded border border-primary/20">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 flex items-center gap-1"><Star size={12} /> Ápice</h4>
                    <div className="text-sm"><span className="font-semibold">{powers?.apice?.nombre}:</span> <span className="text-muted-foreground">{powers?.apice?.desc}</span></div>
                  </div>
                )}
                {(powers?.locked?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1"><Lock size={12} /> Bloqueados</h4>
                    {powers?.locked?.map?.((p: any, i: number) => <div key={i} className="mb-1 text-sm text-muted-foreground/60 flex items-center gap-1"><Lock size={10} /> {p?.nombre} (Nivel {p?.nivelMin})</div>) ?? null}
                  </div>
                )}
              </div>

              {/* Environments */}
              {ld?.entornos && (
                <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                  <h3 className="font-display text-sm font-semibold text-primary mb-3">Modificadores de Entorno</h3>
                  {ld?.entornos?.map?.((e: any, i: number) => <p key={i} className={`text-sm ${(e?.mod ?? 0) > 0 ? 'text-green-700' : 'text-red-700'}`}>{(e?.mod ?? 0) > 0 ? '▲' : '▼'} {e?.tipo}: {fm(e?.mod ?? 0)}</p>) ?? null}
                </div>
              )}

              {/* Class Traits */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2"><Swords size={16} /> Rasgos de Clase: {cd?.nombre}</h3>
                {subData && <p className="text-sm mb-2"><span className="font-semibold">Subclase:</span> {subData?.nombre} — <span className="text-muted-foreground">{subData?.descripcion}</span></p>}
                <div className="space-y-1">
                  {traits?.map?.((r: any, i: number) => <div key={i} className="text-sm"><span className="font-semibold text-secondary">Niv.{r?.nivel}:</span> {r?.nombre}{r?.desc ? <span className="text-muted-foreground"> — {r?.desc}</span> : null}</div>) ?? null}
                </div>
              </div>

              {/* Background */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3">Trasfondo: {td?.nombre}</h3>
                <p className="text-sm italic text-muted-foreground mb-2">{td?.descripcion}</p>
                <p className="text-sm"><span className="font-semibold">Competencias:</span> {td?.competencias?.join?.(', ')}</p>
                <div className="mt-2 p-3 bg-primary/5 rounded border border-primary/20">
                  <p className="text-sm"><Star size={12} className="inline text-primary mr-1" /><span className="font-semibold">{td?.rasgo?.nombre}:</span> {td?.rasgo?.desc}</p>
                </div>
              </div>

              {/* Glory */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2"><Star size={16} /> Puntos de Gloria</h3>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => updateField('puntosGloria', Math.max(0, (char?.puntosGloria ?? 0) - 1))} className="w-8 h-8 rounded bg-muted flex items-center justify-center hover:bg-destructive/20"><Minus size={16} /></button>
                  <span className="font-mono text-3xl font-bold text-primary">{char?.puntosGloria ?? 0}</span>
                  <button onClick={() => updateField('puntosGloria', (char?.puntosGloria ?? 0) + 1)} className="w-8 h-8 rounded bg-muted flex items-center justify-center hover:bg-primary/20"><Plus size={16} /></button>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <h3 className="font-display text-sm font-semibold text-primary mb-3 flex items-center gap-2"><Scroll size={16} /> Notas</h3>
                <textarea value={char?.notas ?? ''} onChange={(e) => updateField('notas', e?.target?.value ?? '')} rows={5} placeholder="Escribe tus notas aquí..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE SHEET */}
      <div className="print-only" style={{ fontSize: '9pt', color: '#2C1A0E', fontFamily: 'Lora, serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '20pt', color: '#1B4F72', margin: 0 }}>{char?.nombre}</h1>
          <p style={{ fontSize: '9pt', color: '#666', margin: '2px 0' }}>{ld?.nombre?.split?.(' — ')?.[0]} · {cd?.nombre}{subData ? ` (${subData?.nombre})` : ''} · Nivel {nivel} · {td?.nombre}</p>
          <div style={{ height: '2px', background: '#C9A227', width: '200px', margin: '6px auto' }} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Print Left Column */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '4px' }}>
              {ATTRS.map((a) => {
                const val = char?.atributos?.[a] ?? 10
                return <div key={a} style={{ textAlign: 'center', border: '1px solid #C9A227', borderRadius: '3px', padding: '3px 6px', flex: 1 }}><div style={{ fontSize: '7pt', color: '#888' }}>{a}</div><div style={{ fontWeight: 'bold', fontSize: '14pt' }}>{val}</div><div style={{ fontSize: '8pt', color: '#C9A227' }}>{fm(getModifier(val))}</div></div>
              })}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <div style={{ border: '1px solid #C9A227', borderRadius: '3px', padding: '4px', textAlign: 'center', flex: 1 }}><div style={{ fontSize: '7pt' }}>PG</div><div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{hpMax}</div></div>
              <div style={{ border: '1px solid #C9A227', borderRadius: '3px', padding: '4px', textAlign: 'center', flex: 1 }}><div style={{ fontSize: '7pt' }}>SD</div><div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{sdMax}</div></div>
              <div style={{ border: '1px solid #C9A227', borderRadius: '3px', padding: '4px', textAlign: 'center', flex: 1 }}><div style={{ fontSize: '7pt' }}>CA</div><div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{ca}</div></div>
              <div style={{ border: '1px solid #C9A227', borderRadius: '3px', padding: '4px', textAlign: 'center', flex: 1 }}><div style={{ fontSize: '7pt' }}>Init</div><div style={{ fontWeight: 'bold', fontSize: '12pt' }}>{fm(iniciativa ?? 0)}</div></div>
              <div style={{ border: '1px solid #C9A227', borderRadius: '3px', padding: '4px', textAlign: 'center', flex: 1 }}><div style={{ fontSize: '7pt' }}>BC</div><div style={{ fontWeight: 'bold', fontSize: '12pt' }}>+{bc}</div></div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Tiradas de Salvación</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                {ATTRS.map((a) => { const sv = getSaveMod(char, a); return <div key={a} style={{ fontSize: '8pt' }}>{sv?.proficient ? '●' : '○'} {fm(sv?.mod ?? 0)} {ATRIBUTO_NOMBRES[a]}</div> })}
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Habilidades</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px' }}>
                {habilidades?.map?.((h) => { const prof = char?.habilidades?.includes?.(h?.id) ?? false; const mod = getSkillMod(char, h?.id); return <div key={h?.id} style={{ fontSize: '7.5pt' }}>{prof ? '●' : '○'} {fm(mod)} {h?.nombre}</div> }) ?? null}
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Trasfondo: {td?.nombre}</h3>
              <p style={{ fontSize: '8pt', fontStyle: 'italic' }}>{td?.rasgo?.nombre}: {td?.rasgo?.desc}</p>
            </div>
          </div>
          {/* Print Right Column */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Poderes: {ld?.nombre?.split?.(' — ')?.[0]}</h3>
              {powers?.pasivos?.map?.((p: any, i: number) => <p key={`pa${i}`} style={{ fontSize: '8pt', marginBottom: '3px' }}><strong>{p?.nombre}:</strong> {p?.desc}</p>) ?? null}
              {powers?.activos?.map?.((p: any, i: number) => <p key={`ac${i}`} style={{ fontSize: '8pt', marginBottom: '3px' }}><strong>{p?.nombre}</strong> ({p?.costeSd} SD): {p?.desc}</p>) ?? null}
              {powers?.apice && <p style={{ fontSize: '8pt', marginBottom: '3px' }}><strong>★ {powers?.apice?.nombre}:</strong> {powers?.apice?.desc}</p>}
              {powers?.locked?.map?.((p: any, i: number) => <p key={`lk${i}`} style={{ fontSize: '7pt', color: '#999' }}>🔒 {p?.nombre} (Niv.{p?.nivelMin})</p>) ?? null}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Rasgos de Clase: {cd?.nombre}</h3>
              {subData && <p style={{ fontSize: '8pt', marginBottom: '3px' }}><strong>Subclase:</strong> {subData?.nombre}</p>}
              {traits?.map?.((r: any, i: number) => <p key={i} style={{ fontSize: '7.5pt', marginBottom: '1px' }}><strong>Niv.{r?.nivel}:</strong> {r?.nombre}{r?.desc ? ` — ${r?.desc}` : ''}</p>) ?? null}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Gloria: {char?.puntosGloria ?? 0}</h3>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '10pt', color: '#1B4F72', borderBottom: '1px solid #C9A227', paddingBottom: '2px', marginBottom: '4px' }}>Notas</h3>
              <p style={{ fontSize: '8pt', whiteSpace: 'pre-wrap' }}>{char?.notas || '(sin notas)'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
