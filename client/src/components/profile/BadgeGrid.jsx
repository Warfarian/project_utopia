export default function BadgeGrid({ badges }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="flex flex-col items-center p-4 border rounded-lg hover:bg-accent/5 transition-colors"
        >
          <span className="text-3xl mb-2">{badge.icon}</span>
          <h3 className="font-medium text-center">{badge.name}</h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            {badge.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}