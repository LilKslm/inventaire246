export default function TeamBadge({ team, size = 'sm' }) {
  if (!team) return null
  const pad = size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs'
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${pad}`}
      style={{ backgroundColor: team.color, color: team.textColor }}
    >
      {team.label}
    </span>
  )
}
