'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Character } from '@/types/character'
import { getCharacters, deleteCharacter, importCharacterJSON, saveCharacter } from '@/lib/storage'
import { getLinaje, getClase, generateId } from '@/lib/character-utils'
import { Plus, Upload, Trash2, ChevronRight, Scroll, Sword, Target, Wand2, Shield, Eye, Hammer, Shuffle, Zap } from 'lucide-react'
import { toast } from 'sonner'

const CI: Record<string, React.ElementType> = { espadachin: Sword, arquero: Target, mago: Wand2, trickster: Shuffle, portador: Shield, oraculo: Eye, forjador: Hammer }

export default function HomeClient() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMounted(true); setCharacters(getCharacters()) }, [])

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este personaje?')) return
    deleteCharacter(id)
    setCharacters(getCharacters())
    toast.success('Personaje eliminado')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    if (!file) return
    try {
      const char = await importCharacterJSON(file)
      saveCharacter({ ...char, id: generateId() })
      setCharacters(getCharacters())
      toast.success(`¡${char?.nombre} importado!`)
    } catch (err: any) { toast.error(err?.message ?? 'Error al importar') }
    if (fileRef?.current) fileRef.current.value = ''
  }

  if (!mounted) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary font-display text-2xl">Cargando...</div></div>

  return (
    <div className="min-h-screen">
      <div className="text-center py-20 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Scroll className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-secondary tracking-tight">Sangre Divina</h1>
          <div className="greek-line w-64 mx-auto my-5" />
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">Creador de Personajes para el TTRPG de mitología griega</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button onClick={() => router.push('/crear')} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-display font-semibold text-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            <Plus size={22} /> Crear Personaje
          </button>
          <label className="bg-secondary text-secondary-foreground px-8 py-3.5 rounded-lg font-display font-semibold text-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={22} /> Importar JSON
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </motion.div>
      </div>

      {(characters?.length ?? 0) > 0 && (
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="font-display text-2xl font-semibold text-secondary mb-6 flex items-center gap-2"><Zap className="text-primary" size={24} /> Mis Personajes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {characters?.map?.((char: Character, i: number) => {
              const lin = getLinaje(char?.linaje)
              const cls = getClase(char?.clase)
              const Icon = CI[char?.clase] ?? Sword
              return (
                <motion.div key={char?.id ?? i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-lg p-5 shadow-md hover:shadow-lg transition-all cursor-pointer border border-border hover:border-primary group relative"
                  onClick={() => router.push(`/personaje/${char?.id}`)}>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Icon className="text-primary" size={24} /></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-semibold text-secondary truncate">{char?.nombre ?? 'Sin nombre'}</h3>
                      <p className="text-sm text-muted-foreground truncate">{lin?.nombre?.split?.(' — ')?.[0] ?? char?.linaje} · {cls?.nombre ?? char?.clase}</p>
                      <p className="text-xs text-muted-foreground mt-1">Nivel {char?.nivel ?? 1}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(char?.id) }}
                    className="absolute bottom-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              )
            }) ?? null}
          </div>
        </div>
      )}

      {(characters?.length ?? 0) === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center pb-20 px-4 text-muted-foreground">
          <p className="text-lg">Aún no tienes personajes guardados</p>
          <p className="text-sm mt-1">Crea uno nuevo o importa un archivo JSON</p>
        </motion.div>
      )}
    </div>
  )
}
