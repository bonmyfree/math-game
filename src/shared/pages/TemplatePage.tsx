import { Construction } from 'lucide-react'

interface TemplatePageProps {
  title: string
  description?: string
}

/**
 * Generic placeholder page rendered by feature menus that don't have real
 * content yet. Keeps the route/folder structure in place while the feature is
 * (re)built.
 */
export function TemplatePage({ title, description }: TemplatePageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
        <Construction size={28} />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="max-w-md text-sm text-slate-500">
          {description ?? 'Tính năng đang được phát triển'}
        </p>
      </div>
    </div>
  )
}
