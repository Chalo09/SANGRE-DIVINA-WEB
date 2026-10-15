'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { linajes } from '@/data/linajes'
import { clases } from '@/data/clases'
import { trasfondos } from '@/data/trasfondos'
import { habilidades as allSkills } from '@/data/habilidades'
import { AtributoKey, Character } from '@/types/character'
import { getModifier, POINT_BUY_COSTS, STANDARD_ARRAY, calculatePointBuyRemaining, calculateHP, calculateSD, XP_TABLE, getProficiencyBonus, ATRIBUTO_NOMBRES } from '@/data/mechanics'
import { saveCharacter } from '@/lib/storage'
import { generateId, getLinaje, getClase, getTrasfondo } from '@/lib/character-utils'
import { Zap, Waves, Leaf, Swords, Sun, BookOpen, Crown, Flame, Heart, Wind, Skull, Sparkles, Sword, Target, Wand2, Shield, Eye, Hammer, Plus, Minus, ChevronLeft, ChevronRight, Check, Lock, ArrowLeft, Shuffle, Star } from 'lucide-react'

const LI: Record<string, React.ElementType> = { zeus: Zap, poseidon: Waves, demeter: Leaf, ares: Swords, apolo: Sun, atenea: BookOpen, hera: Crown, hefesto: Flame, afrodita: Heart, hermes: Wind, dioniso: Wind, hades: Skull, hecate: Sparkles }
const CI: Record<string, React.ElementType> = { espadachin: Sword, arquero: Target, mago: Wand2, trickster: Shuffle, portador: Shield, oraculo: Eye, forjador: Hammer }
const STEPS = ['Linaje', 'Clase', 'Trasfondo', 'Atributos', 'Habilidades', 'Detalles', 'Revisión']
const ATTRS: AtributoKey[] = ['FUE', 'DES', 'CON', 'INT', 'SAB', 'CAR']
const fm = (m: number) => (m >= 0 ? `+${m}` : `${m}`)

export default function WizardClient() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [linaje, setLinaje] = useState('')
  const [clase, setClase] = useState('')
  const [trasfondo, setTrasfondo] = useState('')
  const [subclase, setSubclase] = useState('')
  const [baseAttrs, setBaseAttrs] = useState<Record<AtributoKey, number>>({ FUE: 8, DES: 8, CON: 8, INT: 8, SAB: 8, CAR: 8 })
  const [metodo, setMetodo] = useState<'pointBuy' | 'array'>('pointBuy')
  const [selSkills, setSelSkills] = useState<string[]>([])
  const [nombre, setNombre] = useState('')
  const [nivel, setNivel] = useState(1)
  const [sexo, setSexo] = useState('')
  const [apariencia, setApariencia] = useState('')
  const [historia, setHistoria] = useState('')
  const [personalidad, setPersonalidad] = useState('')

  const ld = useMemo(() => getLinaje(linaje), [linaje])
  const cd = useMemo(() => getClase(clase), [clase])
  const td = useMemo(() => getTrasfondo(trasfondo), [trasfondo])

  const finalAttrs = useMemo(() => {
    const r = { ...baseAttrs }
    if (ld) { for (const [k, v] of Object.entries(ld?.bonificadores ?? {})) { r[k as AtributoKey] = (r[k as AtributoKey] ?? 0) + (v ?? 0) } }
    return r
  }, [baseAttrs, ld])

  const pointsLeft = useMemo(() => calculatePointBuyRemaining(baseAttrs), [baseAttrs])

  const bgSkills = useMemo(() => {
    if (!td) return [] as string[]
    return (td?.competencias ?? []).map((n: string) => allSkills?.find?.((h) => h?.nombre === n)?.id).filter(Boolean) as string[]
  }, [td])

  const classSkillIds = useMemo(() => {
    if (!cd) return [] as string[]
    return (cd?.habilidadesDisponibles ?? []).map((n: string) => allSkills?.find?.((h) => h?.nombre === n)?.id).filter(Boolean) as string[]
  }, [cd])

  const canNext = () => {
    switch (step) {
      case 0: return !!linaje
      case 1: return !!clase
      case 2: return !!trasfondo
      case 3: return metodo === 'array' ? !Object.values(baseAttrs).some((v: number) => v === 0) : pointsLeft === 0
      case 4: return selSkills?.length === (cd?.numHabilidades ?? 0)
      case 5: return (nombre?.trim?.()?.length ?? 0) > 0
      default: return true
    }
  }

  const handleSave = () => {
    const conM = getModifier(finalAttrs?.CON ?? 10)
    const sabM = getModifier(finalAttrs?.SAB ?? 10)
    const hpMax = calculateHP(cd?.dadoGolpe ?? 'd8', conM, nivel)
    const sdMax = calculateSD(ld?.sdBase ?? 10, sabM)
    const skills = [...new Set([...(bgSkills ?? []), ...(selSkills ?? [])])]
    const char: Character = {
      id: generateId(), nombre, nivel, linaje, clase, subclase, trasfondo,
      atributos: finalAttrs, habilidades: skills,
      hpActual: hpMax, hpMaximo: hpMax, hpTemp: 0,
      sdActual: sdMax, sdMaximo: sdMax,
      puntosGloria: 0, xp: XP_TABLE[nivel] ?? 0,
      sexo, apariencia, historia, personalidad,
      idiomas: ['Griego antiguo'], notas: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    saveCharacter(char)
    toast.success('¡Personaje creado con éxito!')
    router.push(`/personaje/${char.id}`)
  }

  const setAttr = (key: AtributoKey, val: number) => {
    if (metodo === 'pointBuy') {
      if (val < 8 || val > 15) return
      const newAttrs = { ...baseAttrs, [key]: val }
      if (calculatePointBuyRemaining(newAttrs) < 0) return
      setBaseAttrs(newAttrs)
    } else {
      setBaseAttrs(prev => ({ ...prev, [key]: val }))
    }
  }

  const switchMetodo = (m: 'pointBuy' | 'array') => {
    setMetodo(m)
    setBaseAttrs({ FUE: m === 'pointBuy' ? 8 : 0, DES: m === 'pointBuy' ? 8 : 0, CON: m === 'pointBuy' ? 8 : 0, INT: m === 'pointBuy' ? 8 : 0, SAB: m === 'pointBuy' ? 8 : 0, CAR: m === 'pointBuy' ? 8 : 0 })
  }

  const toggleSkill = (id: string) => {
    if (bgSkills.includes(id)) return
    setSelSkills(prev => {
      if (prev?.includes?.(id)) return prev.filter((s: string) => s !== id)
      if ((prev?.length ?? 0) >= (cd?.numHabilidades ?? 0)) return prev
      return [...(prev ?? []), id]
    })
  }

  const usedArrayVals = (excludeKey: AtributoKey) => ATTRS.filter(k => k !== excludeKey).map(k => baseAttrs[k]).filter((v: number) => v > 0)

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div>
          <p className="text-muted-foreground mb-6">Elige el linaje divino de tu semidiós. Cada linaje otorga bonificadores, poderes únicos y afinidades de entorno.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {linajes?.map?.((l) => {
              const Icon = LI[l?.id] ?? Zap
              const sel = linaje === l?.id
              return (
                <div key={l?.id} onClick={() => setLinaje(l?.id)} className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${sel ? 'gold-glow border-primary bg-primary/5' : 'border-transparent bg-card hover:border-primary/40'} shadow-sm hover:shadow-md`}>
                  <div className="flex items-center gap-3">
                    <Icon className={sel ? 'text-primary' : 'text-secondary'} size={26} />
                    <div>
                      <h3 className="font-display text-sm font-semibold leading-tight">{l?.nombre?.split?.(' — ')?.[0]}</h3>
                      <p className="text-xs text-primary font-mono">{Object.entries(l?.bonificadores ?? {}).map(([k, v]) => `+${v} ${k}`).join(', ')}</p>
                    </div>
                  </div>
                </div>
              )
            }) ?? null}
          </div>
          {ld && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-card rounded-lg border border-primary/30 shadow-md">
              <h3 className="font-display text-xl text-secondary font-semibold">{ld?.nombre}</h3>
              <p className="text-sm mt-2 italic text-muted-foreground">{ld?.descripcion}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-display text-sm font-semibold text-primary mb-2">Bonificadores</h4>
                  <p className="text-sm">{Object.entries(ld?.bonificadores ?? {}).map(([k, v]) => `+${v} ${ATRIBUTO_NOMBRES[k] ?? k}`).join(', ')}</p>
                  <p className="text-sm mt-1">SD Base: {ld?.sdBase} · Salvación adicional: {ld?.salvacionAdicional}</p>
                  <h4 className="font-display text-sm font-semibold text-primary mt-4 mb-2">Entornos</h4>
                  {ld?.entornos?.map?.((e, i) => <p key={i} className={`text-sm ${(e?.mod ?? 0) > 0 ? 'text-green-700' : 'text-red-700'}`}>{(e?.mod ?? 0) > 0 ? '▲' : '▼'} {e?.tipo}: {fm(e?.mod ?? 0)}</p>) ?? null}
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-primary mb-2">Poderes Pasivos</h4>
                  {ld?.poderes?.pasivos?.map?.((p, i) => <div key={i} className="mb-2"><span className="font-semibold text-sm">{p?.nombre}</span><p className="text-xs text-muted-foreground">{p?.desc}</p></div>) ?? null}
                  <h4 className="font-display text-sm font-semibold text-primary mt-4 mb-2">Poderes Activos</h4>
                  {ld?.poderes?.activos?.map?.((p, i) => <div key={i} className="mb-2"><span className="font-semibold text-sm">{p?.nombre}</span> <span className="text-xs text-primary">({p?.costeSd} SD, Niv.{p?.nivelMin})</span><p className="text-xs text-muted-foreground">{p?.desc}</p></div>) ?? null}
                  <h4 className="font-display text-sm font-semibold text-primary mt-4 mb-2">Ápice</h4>
                  <div><span className="font-semibold text-sm">{ld?.poderes?.apice?.nombre}</span> <span className="text-xs text-primary">(Niv.{ld?.poderes?.apice?.nivelMin})</span><p className="text-xs text-muted-foreground">{ld?.poderes?.apice?.desc}</p></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )
      case 1: return (
        <div>
          <p className="text-muted-foreground mb-6">Elige la clase de tu semidiós. Define tu rol en combate y tus rasgos de nivel.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clases?.map?.((c) => {
              const Icon = CI[c?.id] ?? Sword
              const sel = clase === c?.id
              return (
                <div key={c?.id} onClick={() => { setClase(c?.id); setSelSkills([]); setSubclase('') }} className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${sel ? 'gold-glow border-primary bg-primary/5' : 'border-transparent bg-card hover:border-primary/40'} shadow-sm hover:shadow-md`}>
                  <div className="flex items-center gap-3">
                    <Icon className={sel ? 'text-primary' : 'text-secondary'} size={26} />
                    <div>
                      <h3 className="font-display text-sm font-semibold">{c?.nombre}</h3>
                      <p className="text-xs text-muted-foreground">DG: {c?.dadoGolpe} · {c?.atributoPrincipal?.join?.('/')}</p>
                    </div>
                  </div>
                </div>
              )
            }) ?? null}
          </div>
          {cd && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-card rounded-lg border border-primary/30 shadow-md">
              <h3 className="font-display text-xl text-secondary font-semibold">{cd?.nombre}</h3>
              <p className="text-sm mt-2 italic text-muted-foreground">{cd?.descripcion}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                <div><span className="text-primary font-semibold">Dado de Golpe:</span> {cd?.dadoGolpe}</div>
                <div><span className="text-primary font-semibold">Salvaciones:</span> {cd?.salvaciones?.join?.(', ')}</div>
                <div><span className="text-primary font-semibold">Armaduras:</span> {(cd?.armaduras?.length ?? 0) > 0 ? cd?.armaduras?.join?.(', ') : 'Ninguna'}</div>
                <div><span className="text-primary font-semibold">Habilidades:</span> {cd?.numHabilidades} a elegir</div>
              </div>
              <h4 className="font-display text-sm font-semibold text-primary mt-4 mb-2">Subclases (Nivel {cd?.subclases?.[0]?.nivelDesbloqueo ?? 3})</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {cd?.subclases?.map?.((s) => <div key={s?.id} className="p-3 bg-background/50 rounded border border-border"><span className="font-semibold text-sm">{s?.nombre}</span><p className="text-xs text-muted-foreground mt-1">{s?.descripcion}</p></div>) ?? null}
              </div>
              <h4 className="font-display text-sm font-semibold text-primary mt-4 mb-2">Rasgos principales</h4>
              <div className="text-sm space-y-1">
                {cd?.rasgos?.filter?.((r) => r?.desc)?.slice?.(0, 5)?.map?.((r, i) => <p key={i}><span className="font-semibold">Niv.{r?.nivel}:</span> {r?.nombre} — <span className="text-muted-foreground text-xs">{r?.desc}</span></p>) ?? null}
              </div>
            </motion.div>
          )}
        </div>
      )
      case 2: return (
        <div>
          <p className="text-muted-foreground mb-6">Elige el trasfondo de tu semidiós. Otorga competencias adicionales y un rasgo especial.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trasfondos?.map?.((t) => {
              const sel = trasfondo === t?.id
              return (
                <div key={t?.id} onClick={() => setTrasfondo(t?.id)} className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${sel ? 'gold-glow border-primary bg-primary/5' : 'border-transparent bg-card hover:border-primary/40'} shadow-sm hover:shadow-md`}>
                  <h3 className="font-display text-sm font-semibold">{t?.nombre}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t?.descripcion}</p>
                  <p className="text-xs text-primary mt-2 font-mono">Competencias: {t?.competencias?.join?.(', ')}</p>
                  <p className="text-xs mt-1"><Star size={12} className="inline text-primary mr-1" /><span className="font-semibold">{t?.rasgo?.nombre}:</span> <span className="text-muted-foreground">{t?.rasgo?.desc}</span></p>
                </div>
              )
            }) ?? null}
          </div>
        </div>
      )
      case 3: return (
        <div>
          <p className="text-muted-foreground mb-4">Asigna los atributos de tu semidiós. Los bonificadores de linaje se aplican automáticamente.</p>
          <div className="flex gap-2 mb-6">
            <button onClick={() => switchMetodo('pointBuy')} className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all ${metodo === 'pointBuy' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'}`}>Point Buy (27 pts)</button>
            <button onClick={() => switchMetodo('array')} className={`px-4 py-2 rounded-lg font-display text-sm font-semibold transition-all ${metodo === 'array' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border border-border'}`}>Array Estándar</button>
          </div>
          {metodo === 'pointBuy' && <div className={`text-center mb-4 font-display text-lg font-semibold ${pointsLeft === 0 ? 'text-green-700' : pointsLeft < 0 ? 'text-destructive' : 'text-secondary'}`}>Puntos restantes: {pointsLeft}</div>}
          <div className="space-y-3">
            {ATTRS.map((a) => {
              const bonus = (ld?.bonificadores?.[a] ?? 0)
              const base = baseAttrs[a] ?? (metodo === 'pointBuy' ? 8 : 0)
              const final_ = base + bonus
              const mod = getModifier(final_)
              const used = usedArrayVals(a)
              return (
                <div key={a} className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border">
                  <span className="w-14 font-display font-semibold text-secondary">{a}</span>
                  <span className="text-xs text-muted-foreground w-20 hidden sm:block">{ATRIBUTO_NOMBRES[a]}</span>
                  {metodo === 'pointBuy' ? (
                    <>
                      <button onClick={() => setAttr(a, base - 1)} disabled={base <= 8} className="w-8 h-8 rounded bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-30 hover:brightness-110"><Minus size={16} /></button>
                      <span className="w-8 text-center font-mono text-lg font-semibold">{base}</span>
                      <button onClick={() => setAttr(a, base + 1)} disabled={base >= 15} className="w-8 h-8 rounded bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-30 hover:brightness-110"><Plus size={16} /></button>
                      <span className="text-xs text-muted-foreground w-16">Coste: {POINT_BUY_COSTS[base] ?? 0}</span>
                    </>
                  ) : (
                    <select value={base} onChange={(e) => setAttr(a, Number(e?.target?.value ?? 0))} className="bg-background border border-border rounded px-2 py-1 text-sm">
                      <option value={0}>--</option>
                      {STANDARD_ARRAY.map((v) => {
                        const isUsed = used.includes(v)
                        return <option key={v} value={v} disabled={isUsed}>{v}{isUsed ? ' (usado)' : ''}</option>
                      })}
                    </select>
                  )}
                  {bonus > 0 && <span className="text-xs text-primary font-semibold">+{bonus}</span>}
                  <span className="text-xs">=</span>
                  <span className="font-mono font-semibold w-8 text-center">{base > 0 ? final_ : '-'}</span>
                  <span className="text-sm text-muted-foreground font-mono w-10 text-right">{base > 0 ? `(${fm(mod)})` : ''}</span>
                </div>
              )
            })}
          </div>
          {metodo === 'pointBuy' && <p className="text-xs text-muted-foreground mt-3">Valores base permitidos: 8–15. Coste: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9.</p>}
        </div>
      )
      case 4: return (
        <div>
          <p className="text-muted-foreground mb-2">Elige <span className="font-semibold text-primary">{cd?.numHabilidades ?? 0}</span> habilidades de tu clase. Las del trasfondo ya están incluidas.</p>
          <p className="text-sm text-muted-foreground mb-4">Seleccionadas: {selSkills?.length ?? 0} / {cd?.numHabilidades ?? 0}</p>
          {(bgSkills?.length ?? 0) > 0 && (
            <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Del trasfondo (automáticas):</p>
              <p className="text-sm">{bgSkills.map((id: string) => allSkills?.find?.((h) => h?.id === id)?.nombre ?? id).join(', ')}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {classSkillIds?.map?.((id: string) => {
              const skill = allSkills?.find?.((h) => h?.id === id)
              if (!skill) return null
              const isBg = bgSkills.includes(id)
              const isSel = selSkills?.includes?.(id) ?? false
              const disabled = isBg || (!isSel && (selSkills?.length ?? 0) >= (cd?.numHabilidades ?? 0))
              return (
                <label key={id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${isBg ? 'bg-primary/5 border-primary/20 opacity-60' : isSel ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/40'} ${disabled && !isBg ? 'opacity-40' : ''}`}>
                  <input type="checkbox" checked={isSel || isBg} disabled={disabled} onChange={() => toggleSkill(id)} className="accent-primary" />
                  <span className="text-sm">{skill?.nombre}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{skill?.atributo}</span>
                  {isBg && <span className="text-xs text-primary">(trasfondo)</span>}
                </label>
              )
            }) ?? null}
          </div>
        </div>
      )
      case 5: return (
        <div className="space-y-4">
          <p className="text-muted-foreground mb-2">Completa los detalles de tu semidiós.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre *</label>
              <input value={nombre} onChange={(e) => setNombre(e?.target?.value ?? '')} placeholder="Nombre del personaje" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Nivel (1–20)</label>
              <input type="number" min={1} max={20} value={nivel} onChange={(e) => setNivel(Math.min(20, Math.max(1, Number(e?.target?.value ?? 1))))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
              <p className="text-xs text-muted-foreground mt-1">XP necesaria: {(XP_TABLE[nivel] ?? 0).toLocaleString('es-ES')} · BC: +{getProficiencyBonus(nivel)}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Sexo / Género</label>
              <input value={sexo} onChange={(e) => setSexo(e?.target?.value ?? '')} placeholder="Opcional" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none" />
            </div>
            {cd && nivel >= (cd?.subclases?.[0]?.nivelDesbloqueo ?? 3) && (
              <div>
                <label className="block text-sm font-semibold mb-1">Subclase</label>
                <select value={subclase} onChange={(e) => setSubclase(e?.target?.value ?? '')} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  <option value="">-- Seleccionar --</option>
                  {cd?.subclases?.map?.((s) => <option key={s?.id} value={s?.id}>{s?.nombre}</option>) ?? null}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Apariencia</label>
            <textarea value={apariencia} onChange={(e) => setApariencia(e?.target?.value ?? '')} rows={3} placeholder="Describe la apariencia de tu personaje..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Historia Personal</label>
            <textarea value={historia} onChange={(e) => setHistoria(e?.target?.value ?? '')} rows={3} placeholder="Cuéntanos la historia de tu semidiós..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Personalidad</label>
            <textarea value={personalidad} onChange={(e) => setPersonalidad(e?.target?.value ?? '')} rows={2} placeholder="Rasgos de personalidad, ideales, defectos..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none" />
          </div>
        </div>
      )
      case 6: {
        const conM = getModifier(finalAttrs?.CON ?? 10)
        const sabM = getModifier(finalAttrs?.SAB ?? 10)
        const desM = getModifier(finalAttrs?.DES ?? 10)
        const hpMax = calculateHP(cd?.dadoGolpe ?? 'd8', conM, nivel)
        const sdMax = calculateSD(ld?.sdBase ?? 10, sabM)
        const bc = getProficiencyBonus(nivel)
        const allSk = [...new Set([...(bgSkills ?? []), ...(selSkills ?? [])])]
        const subData = cd?.subclases?.find?.((s) => s?.id === subclase)
        return (
          <div>
            <p className="text-muted-foreground mb-6">Revisa tu personaje antes de guardarlo.</p>
            <div className="bg-card rounded-lg border border-primary/30 p-6 shadow-md space-y-4">
              <div className="text-center">
                <h3 className="font-display text-2xl font-bold text-secondary">{nombre || 'Sin nombre'}</h3>
                <p className="text-sm text-muted-foreground">{ld?.nombre?.split?.(' — ')?.[0]} · {cd?.nombre} {subData ? `(${subData?.nombre})` : ''} · Nivel {nivel}</p>
                <p className="text-xs text-muted-foreground">{td?.nombre}</p>
              </div>
              <div className="greek-line" />
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {ATTRS.map((a) => (<div key={a} className="stat-block"><div className="text-xs text-muted-foreground">{a}</div><div className="font-mono text-lg font-bold">{finalAttrs[a]}</div><div className="text-xs text-primary font-mono">{fm(getModifier(finalAttrs[a] ?? 10))}</div></div>))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-sm">
                <div className="stat-block"><div className="text-xs text-muted-foreground">PG</div><div className="font-mono font-bold text-lg">{hpMax}</div></div>
                <div className="stat-block"><div className="text-xs text-muted-foreground">SD</div><div className="font-mono font-bold text-lg">{sdMax}</div></div>
                <div className="stat-block"><div className="text-xs text-muted-foreground">CA</div><div className="font-mono font-bold text-lg">{10 + desM}</div></div>
                <div className="stat-block"><div className="text-xs text-muted-foreground">Iniciativa</div><div className="font-mono font-bold text-lg">{fm(desM)}</div></div>
                <div className="stat-block"><div className="text-xs text-muted-foreground">BC</div><div className="font-mono font-bold text-lg">+{bc}</div></div>
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-primary mb-1">Habilidades con competencia</h4>
                <p className="text-sm">{allSk.map((id: string) => allSkills?.find?.((h) => h?.id === id)?.nombre ?? id).join(', ') || 'Ninguna'}</p>
              </div>
              {sexo && <p className="text-sm"><span className="font-semibold">Sexo:</span> {sexo}</p>}
              {apariencia && <p className="text-sm"><span className="font-semibold">Apariencia:</span> {apariencia}</p>}
              {historia && <p className="text-sm"><span className="font-semibold">Historia:</span> {historia}</p>}
            </div>
          </div>
        )
      }
      default: return null
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"><ArrowLeft size={16} /> Volver al inicio</button>
        <h1 className="font-display text-3xl font-bold text-secondary mb-2">Crear Personaje</h1>
        <div className="greek-line mb-8" />
        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-all ${
                i < step ? 'bg-primary/20 text-primary' : i === step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check size={14} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-muted-foreground mx-1 shrink-0" />}
            </div>
          ))}
        </div>
        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <h2 className="font-display text-xl font-semibold text-secondary mb-4">{STEPS[step]}</h2>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-border">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-border text-sm font-display font-semibold disabled:opacity-30 hover:bg-muted transition-colors">
            <ChevronLeft size={16} /> Anterior
          </button>
          {step < 6 ? (
            <button onClick={() => { if (canNext()) setStep(step + 1); else toast.error('Completa este paso antes de continuar') }} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all ${canNext() ? 'bg-primary text-primary-foreground hover:brightness-110' : 'bg-muted text-muted-foreground'}`}>
              Siguiente <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-display font-semibold hover:brightness-110 transition-all shadow-md">
              <Check size={16} /> Crear Personaje
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
