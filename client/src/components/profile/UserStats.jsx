export default function UserStats({ stats }) {
  const items = [
    {
      label: 'Pins Created',
      value: stats.pinsCreated,
      icon: '📍'
    },
    {
      label: 'Volunteer Hours',
      value: stats.volunteeredHours,
      icon: '⏰'
    },
    {
      label: 'Rewards Earned',
      value: stats.rewardsEarned,
      icon: '🎁'
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center p-4 border rounded-lg bg-background/50"
        >
          <span className="text-2xl mb-2">{item.icon}</span>
          <span className="text-2xl font-bold">{item.value}</span>
          <span className="text-sm text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}