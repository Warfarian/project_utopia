import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getCurrentLocation } from '@/lib/utils/location'

export default function LocationDetector({ onLocationUpdate }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const detectLocation = async () => {
    setLoading(true)
    setError(null)

    try {
      const location = await getCurrentLocation()
      onLocationUpdate(location)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Try to get location on mount
  useEffect(() => {
    detectLocation()
  }, [])

  if (error) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={loading}
        >
          {loading ? 'Detecting...' : 'Retry'}
        </Button>
      </div>
    )
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Detecting your location...</p>
  }

  return null
}