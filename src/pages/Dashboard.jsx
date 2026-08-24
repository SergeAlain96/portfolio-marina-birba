import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import ProfileManager from '../components/admin/ProfileManager'
import ExperiencesManager from '../components/admin/ExperiencesManager'
import EducationManager from '../components/admin/EducationManager'
import SkillsManager from '../components/admin/SkillsManager'
import ProjectsManager from '../components/admin/ProjectsManager'

const tabs = [
  { key: 'profile', label: 'Profil', component: ProfileManager },
  { key: 'experiences', label: 'Expériences', component: ExperiencesManager },
  { key: 'education', label: 'Formations', component: EducationManager },
  { key: 'skills', label: 'Compétences', component: SkillsManager },
  { key: 'projects', label: 'Projets', component: ProjectsManager },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const navigate = useNavigate()

  const ActiveComponent = tabs.find((tab) => tab.key === activeTab).component

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-secondary">Tableau de bord</h1>
        <button onClick={handleLogout} className="text-sm font-medium text-primary">
          Déconnexion
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'bg-white text-secondary hover:bg-accent/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </section>
  )
}
