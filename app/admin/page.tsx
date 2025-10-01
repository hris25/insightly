'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Users, FileText, BarChart3, Plus, Edit, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

type Module = { id: string; title: string; description: string; order: number; isActive: boolean }
type Question = { id: string; text: string; order: number; isRequired: boolean; moduleId: string }

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'modules'|'users'|'analytics'|'settings'>('modules')
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null)
  const [moduleFormBusy, setModuleFormBusy] = useState(false)
  const [qs, setQs] = useState<Question[]>([])
  const [qEditing, setQEditing] = useState<Partial<Question> | null>(null)
  const [qBusy, setQBusy] = useState(false)
  const [qLoading, setQLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'module'|'question', id: string, label: string } | null>(null)
  // Pagination states
  const [modPage, setModPage] = useState(1)
  const [modPageSize, setModPageSize] = useState(6)
  const [qPage, setQPage] = useState(1)
  const [qPageSize, setQPageSize] = useState(8)

  const tabs = useMemo(() => ([
    { id: 'modules', label: 'Modules', icon: FileText },
    { id: 'users', label: 'Utilisateurs', icon: Users },
  ] as const), [])

  const loadModules = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/modules')
      const data = await res.json()
      setModules(data)
      if (data?.length && !selectedModule) setSelectedModule(data[0])
      setModPage(1)
    } catch {
      toast.error('Erreur de chargement des modules')
    } finally { setLoading(false) }
  }

  const loadQuestions = async (moduleId: string) => {
    try {
      setQLoading(true)
      const res = await fetch(`/api/modules/${moduleId}`)
      const data = await res.json()
      setQs((data?.questions ?? []).sort((a: Question, b: Question) => a.order - b.order))
      setQPage(1)
    } catch {
      toast.error('Erreur de chargement des questions')
    } finally { setQLoading(false) }
  }

  useEffect(() => { loadModules() }, [])
  useEffect(() => { if (selectedModule) loadQuestions(selectedModule.id) }, [selectedModule?.id])

  const submitModule = async () => {
    if (!editingModule) return
    try {
      setModuleFormBusy(true)
      const payload = { ...editingModule }
      const method = editingModule.id ? 'PUT' : 'POST'
      const url = editingModule.id ? `/api/modules/${editingModule.id}` : '/api/modules'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Erreur API module')
      toast.success('Module enregistré')
      setEditingModule(null)
      await loadModules()
    } catch { toast.error('Impossible d\'enregistrer le module') }
    finally { setModuleFormBusy(false) }
  }

  const submitQuestion = async () => {
    if (!qEditing || !selectedModule) return
    try {
      setQBusy(true)
      const body = { ...qEditing, moduleId: selectedModule.id, type: 'text', isRequired: qEditing.isRequired ?? true, order: qEditing.order ?? (qs.length + 1) }
      const method = qEditing.id ? 'PUT' : 'POST'
      const url = qEditing.id ? `/api/questions/${qEditing.id}` : '/api/questions'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Erreur API question')
      toast.success('Question enregistrée')
      setQEditing(null)
      await loadQuestions(selectedModule.id)
    } catch { toast.error('Impossible d\'enregistrer la question') }
    finally { setQBusy(false) }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard Administrateur</h1>
          <p className="text-gray-300">Gérez les modules, questions et utilisateurs</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/80 rounded-xl shadow-lg mb-6">
          <div className="flex flex-wrap border-b border-gray-700">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 ${activeTab===tab.id?'text-primary-300 border-b-2 border-primary-400':'text-gray-300 hover:text-primary-300'}`}>
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab==='modules' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Modules list */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Modules</h2>
                    <button onClick={() => setEditingModule({ title:'', description:'', order: modules.length+1, isActive:true })} className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                      <Plus className="w-4 h-4"/> Nouveau
                    </button>
                  </div>
                  {loading && <div className="text-gray-400">Chargement...</div>}
                  {!loading && (
                    <>
                      {(modules.slice((modPage-1)*modPageSize, (modPage)*modPageSize)).map(m => (
                    <div key={m.id} className="bg-gray-700/60 rounded-lg p-4 mb-3 flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{m.title}</div>
                        <div className="text-gray-300 text-sm mb-2">{m.description}</div>
                        <div className="text-xs text-gray-400">Ordre: {m.order} • {m.isActive?'Actif':'Inactif'}</div>
                      </div>
                      <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-600" onClick={() => { setSelectedModule(m); }}>
                          Voir questions
                        </button>
                            <button className="p-2 rounded-lg text-gray-200 hover:text-primary-300" onClick={() => setEditingModule(m)}><Edit className="w-4 h-4"/></button>
                            <button className="p-2 rounded-lg text-gray-200 hover:text-red-400" onClick={()=> setConfirmDelete({ type:'module', id: m.id, label: m.title })}><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                      ))}
                      {/* Modules pagination controls */}
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                        <div>
                          Page {modPage} / {Math.max(1, Math.ceil(modules.length / modPageSize))}
                        </div>
                        <div className="flex gap-2">
                          <button disabled={modPage===1} onClick={()=> setModPage(p=> Math.max(1, p-1))} className="px-3 py-1 rounded bg-gray-700 disabled:opacity-40">Précédent</button>
                          <button disabled={modPage>=Math.ceil(modules.length/modPageSize)} onClick={()=> setModPage(p=> Math.min(Math.ceil(modules.length/modPageSize)||1, p+1))} className="px-3 py-1 rounded bg-gray-700 disabled:opacity-40">Suivant</button>
                          <select className="bg-gray-700 rounded px-2" value={modPageSize} onChange={e=> { setModPageSize(Number(e.target.value)); setModPage(1) }}>
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Questions panel */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Questions {selectedModule ? `• ${selectedModule.title}` : ''}</h2>
                    {selectedModule && (
                      <button onClick={()=> setQEditing({ id:'', text:'', order: qs.length+1, isRequired:true, moduleId: selectedModule.id })} className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"><Plus className="w-4 h-4"/> Nouvelle</button>
                    )}
                  </div>
                  {!selectedModule && <div className="text-gray-400">Sélectionnez un module pour gérer ses questions</div>}
                  {selectedModule && (
                    <div className="space-y-3">
                      {qLoading && (
                        <>
                          {Array.from({ length: Math.min(qPageSize, 4) }).map((_,i)=> (
                            <div key={i} className="bg-gray-700/40 rounded-lg p-4 animate-pulse">
                              <div className="h-4 bg-gray-600 rounded w-2/3 mb-2"></div>
                              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                            </div>
                          ))}
                        </>
                      )}
                      {!qLoading && (qs.slice((qPage-1)*qPageSize, qPage*qPageSize)).map(q => (
                        <div key={q.id} className="bg-gray-700/60 rounded-lg p-4 flex items-start justify-between">
                          <div>
                            <div className="font-medium">#{q.order} — {q.text}</div>
                            <div className="text-xs text-gray-400">Requise: {q.isRequired?'Oui':'Non'}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 rounded-lg text-gray-200 hover:text-primary-300" onClick={()=> setQEditing(q)}><Edit className="w-4 h-4"/></button>
                            <button className="p-2 rounded-lg text-gray-200 hover:text-red-400" onClick={()=> setConfirmDelete({ type:'question', id: q.id, label: q.text })}><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}
                      {/* Questions pagination controls */}
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                        <div>
                          Page {qPage} / {Math.max(1, Math.ceil(qs.length / qPageSize))}
                        </div>
                        <div className="flex gap-2">
                          <button disabled={qPage===1} onClick={()=> setQPage(p=> Math.max(1, p-1))} className="px-3 py-1 rounded bg-gray-700 disabled:opacity-40">Précédent</button>
                          <button disabled={qPage>=Math.ceil(qs.length/qPageSize)} onClick={()=> setQPage(p=> Math.min(Math.ceil(qs.length/qPageSize)||1, p+1))} className="px-3 py-1 rounded bg-gray-700 disabled:opacity-40">Suivant</button>
                          <select className="bg-gray-700 rounded px-2" value={qPageSize} onChange={e=> { setQPageSize(Number(e.target.value)); setQPage(1) }}>
                            <option value={5}>5</option>
                            <option value={8}>8</option>
                            <option value={12}>12</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab==='users' && (
              <div className="text-gray-300">Gestion des utilisateurs à venir (listing des emails saisis, sessions, etc.).</div>
            )}

            {activeTab==='analytics' && (
              <div className="text-gray-300">KPIs à venir (sessions, taux de complétion, etc.).</div>
            )}

            {activeTab==='settings' && (
              <div className="text-gray-300">Paramètres (clé OpenRouter, couleurs, etc.).</div>
            )}
          </div>
        </motion.div>

        {/* Module editor modal */}
        {editingModule && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-2xl relative">
              <button onClick={()=> setEditingModule(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-lg font-bold mb-4">{editingModule.id? 'Modifier le module' : 'Nouveau module'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Titre</label>
                <input className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" value={editingModule.title ?? ''} onChange={e=> setEditingModule(prev=>({ ...prev!, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Ordre</label>
                <input type="number" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" value={editingModule.order ?? 1} onChange={e=> setEditingModule(prev=>({ ...prev!, order: Number(e.target.value) }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">Description</label>
                <textarea className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" rows={3} value={editingModule.description ?? ''} onChange={e=> setEditingModule(prev=>({ ...prev!, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Actif</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" value={(editingModule.isActive ?? true) ? '1' : '0'} onChange={e=> setEditingModule(prev=>({ ...prev!, isActive: e.target.value==='1' }))}>
                  <option value="1">Oui</option>
                  <option value="0">Non</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={()=> setEditingModule(null)}>Annuler</button>
              <button disabled={moduleFormBusy} className="px-4 py-2 bg-primary-600 rounded-lg disabled:opacity-50" onClick={submitModule}>{moduleFormBusy? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
            </div>
          </div>
        )}

        {/* Question editor modal */}
        {qEditing && selectedModule && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-2xl relative">
              <button onClick={()=> setQEditing(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h3 className="text-lg font-bold mb-4">{qEditing.id? 'Modifier la question' : 'Nouvelle question'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">Intitulé</label>
                <textarea className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" rows={3} value={qEditing.text ?? ''} onChange={e=> setQEditing(prev=>({ ...prev!, text: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Ordre</label>
                <input type="number" className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" value={qEditing.order ?? 1} onChange={e=> setQEditing(prev=>({ ...prev!, order: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Requise</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" value={(qEditing.isRequired ?? true) ? '1' : '0'} onChange={e=> setQEditing(prev=>({ ...prev!, isRequired: e.target.value==='1' }))}>
                  <option value="1">Oui</option>
                  <option value="0">Non</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={()=> setQEditing(null)}>Annuler</button>
              <button disabled={qBusy} className="px-4 py-2 bg-primary-600 rounded-lg disabled:opacity-50" onClick={submitQuestion}>{qBusy? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
            </div>
          </div>
        )}

        {/* Delete confirm modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl w-full max-w-md">
              <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
              <p className="text-gray-300 mb-4">Êtes-vous sûr de vouloir supprimer « {confirmDelete.label} » ?</p>
              <div className="flex gap-3 justify-end">
                <button className="px-4 py-2 bg-gray-700 rounded-lg" onClick={()=> setConfirmDelete(null)}>Annuler</button>
                <button className="px-4 py-2 bg-red-600 rounded-lg" onClick={async()=>{
                  try {
                    if (confirmDelete.type==='module') {
                      const r = await fetch(`/api/modules/${confirmDelete.id}`, { method:'DELETE' })
                      if (!r.ok) throw new Error()
                      if (selectedModule?.id===confirmDelete.id) { setSelectedModule(null); setQs([]) }
                      await loadModules()
                    } else {
                      if (!selectedModule) return
                      const r = await fetch(`/api/questions/${confirmDelete.id}`, { method:'DELETE' })
                      if (!r.ok) throw new Error()
                      await loadQuestions(selectedModule.id)
                    }
                    toast.success('Supprimé')
                  } catch { toast.error('Suppression impossible') }
                  finally { setConfirmDelete(null) }
                }}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
