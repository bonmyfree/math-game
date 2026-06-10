import { LayoutDashboard, Users, BarChart2, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const stats = [
  { icon: <Users size={22} />, color: 'bg-blue-500', labelKey: 'nav.users', value: '1,284' },
  { icon: <BarChart2 size={22} />, color: 'bg-emerald-500', labelKey: 'nav.reports', value: '48' },
  {
    icon: <TrendingUp size={22} />,
    color: 'bg-violet-500',
    labelKey: 'nav.dashboard',
    value: '92%',
  },
]

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Page title */}
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard size={22} className="text-blue-500" />
        <h1 className="text-xl font-bold text-slate-800">{t('nav.dashboard')}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div
              className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500">{t(s.labelKey)}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder chart area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Overview</h2>
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Chart / Content goes here
        </div>
      </div>
    </div>
  )
}
