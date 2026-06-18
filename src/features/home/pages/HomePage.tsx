import { Home, Users, BarChart2, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const stats = [
  { icon: <Users size={22} />, color: 'bg-blue-500', labelKey: 'nav.users', value: 'Lớp 1' },
  {
    icon: <BarChart2 size={22} />,
    color: 'bg-emerald-500',
    labelKey: 'nav.reports',
    value: 'Lớp 2',
  },
  {
    icon: <TrendingUp size={22} />,
    color: 'bg-violet-500',
    labelKey: 'nav.home',
    value: 'Lớp 3',
  },
]

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Page title */}
      <div className="flex items-center gap-3 mb-6">
        <Home size={22} className="text-blue-500" />
        <h1 className="text-xl font-bold text-slate-800">{t('nav.home')}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div
              className={`${s.color} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500">{t(s.labelKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
