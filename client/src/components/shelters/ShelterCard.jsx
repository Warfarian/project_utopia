import { Button } from '@/components/ui/button'
import { formatDistance } from '@/lib/utils/haversine'

export default function ShelterCard({ shelter, distance }) {
  const handleOpenMap = () => {
    const searchQuery = `${shelter.name} ${shelter.address} ${shelter.coordinates.lat},${shelter.coordinates.lng}`
    const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`
    window.open(url, '_blank')
  }

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{shelter.name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{shelter.address}</p>
          {distance !== undefined && (
            <span className="text-xs bg-accent/10 text-accent-foreground px-2 py-0.5 rounded">
              {formatDistance(distance)}
            </span>
          )}
        </div>
      </div>
      
      {shelter.hours && (
        <div>
          <p className="text-sm font-medium">Hours</p>
          <p className="text-sm text-muted-foreground">{shelter.hours}</p>
        </div>
      )}
      
      {shelter.phone && (
        <div>
          <p className="text-sm font-medium">Phone</p>
          <p className="text-sm text-muted-foreground">{shelter.phone}</p>
        </div>
      )}
      
      {shelter.description && (
        <p className="text-sm text-muted-foreground">{shelter.description}</p>
      )}
      
      <div className="flex gap-4">
        <Button onClick={handleOpenMap} variant="outline" size="sm">
          View on Map
        </Button>
        {shelter.website && (
          <Button
            as="a"
            href={shelter.website}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
          >
            Visit Website
          </Button>
        )}
      </div>
    </div>
  )
}