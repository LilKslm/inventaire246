export default function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-apple-dark font-semibold text-base mb-1">{title}</p>
      {subtitle && <p className="text-apple-secondary text-sm">{subtitle}</p>}
    </div>
  )
}
