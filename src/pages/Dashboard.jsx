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
import GeoLogo from '../components/GeoLogo'
import ProfileManager from '../components/admin/ProfileManager'
import ExperiencesManager from '../components/admin/ExperiencesManager'
import EducationManager from '../components/admin/EducationManager'
import SkillsManager from '../components/admin/SkillsManager'
import ServicesManager from '../components/admin/ServicesManager'
import ProjectsManager from '../components/admin/ProjectsManager'
import PasswordManager from '../components/admin/PasswordManager'

const tabs = [
  { key: 'profile', label: 'Profil', icon: TbUser, component: ProfileManager },
  { key: 'experiences', label: 'Expériences', icon: TbBriefcase, component: ExperiencesManager },
  { key: 'education', label: 'Formations', icon: TbSchool, component: EducationManager },
  { key: 'skills', label: 'Compétences', icon: TbChartDots3, component: SkillsManager },
  { key: 'services', label: 'Services', icon: TbBriefcase, component: ServicesManager },
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
      {/* Barre superieure : mobile uniquement */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-secondary/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-white">
              <GeoLogo size={18} />
            </span>
            <span className="text-sm font-semibold text-secondary">Administration</span>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Déconnexion"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <TbLogout size={18} />
          </button>
        </div>

        {/* Onglets : defilement horizontal, pas de retour a la ligne */}
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'text-secondary/70 hover:bg-secondary/5'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 grid md:grid-cols-[220px_1fr] gap-6 md:gap-8 items-start">
        {/* Barre laterale : desktop uniquement */}
        <aside className="hidden md:block bg-white rounded-2xl shadow-sm p-4 sticky top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-text/50 px-3 mb-3">
            Administration
          </p>
          <nav className="flex flex-col gap-1">
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

        <main className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-secondary mb-4 md:mb-6">
            {active.label}
          </h1>
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  )
}
