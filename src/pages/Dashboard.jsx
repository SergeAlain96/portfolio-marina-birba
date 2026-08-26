import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TbBriefcase,
  TbChartDots3,
  TbLayoutGrid,
  TbLogout,
  TbSchool,
  TbShieldLock,
  TbUser,
} from 'react-icons/tb'
import { supabase } from '../services/supabase'
import ProfileManager from '../components/admin/ProfileManager'
import ExperiencesManager from '../components/admin/ExperiencesManager'
import EducationManager from '../components/admin/EducationManager'
import SkillsManager from '../components/admin/SkillsManager'
import ProjectsManager from '../components/admin/ProjectsManager'
import PasswordManager from '../components/admin/PasswordManager'

const tabs = [
  { key: 'profile', label: 'Profil', icon: TbUser, component: ProfileManager },
  { key: 'experiences', label: 'Expériences', icon: TbBriefcase, component: ExperiencesManager },
  { key: 'education', label: 'Formations', icon: TbSchool, component: EducationManager },
  { key: 'skills', label: 'Compétences', icon: TbChartDots3, component: SkillsManager },
  { key: 'projects', label: 'Projets', icon: TbLayoutGrid, component: ProjectsManager },
  { key: 'security', label: 'Sécurité', icon: TbShieldLock, component: PasswordManager },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const navigate = useNavigate()

  const active = tabs.find((tab) => tab.key === activeTab)
  const ActiveComponent = active.component

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-8 items-start">
        <aside className="bg-white rounded-2xl shadow-sm p-4 md:sticky md:top-24">
          <p className="text-xs font-semibold uppercase text-text/50 px-3 mb-3">Administration</p>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:bg-primary/10'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 mt-4 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <TbLogout size={18} />
            Déconnexion
          </button>
        </aside>

        <main>
          <h1 className="text-2xl font-bold text-secondary mb-6">{active.label}</h1>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  )
}
