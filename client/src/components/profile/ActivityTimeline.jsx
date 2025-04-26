export default function ActivityTimeline({ activities }) {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex-none">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {activity.type === 'food' && '🥘'}
              {activity.type === 'animal' && '🐾'}
              {activity.type === 'homeless' && '🏠'}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{activity.organization}</p>
              <p className="text-sm text-muted-foreground">
                {activity.date.toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-sm font-medium text-primary">{activity.hours} hours</p>
          </div>
        </div>
      ))}
    </div>
  )
}