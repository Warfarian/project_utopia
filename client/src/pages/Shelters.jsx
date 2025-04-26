import { useState, useMemo } from 'react'
import { shelters } from '@/lib/constants/shelters'
import { calculateDistance } from '@/lib/utils/haversine'
import ShelterCard from '@/components/shelters/ShelterCard'
import ShelterTypeFilter from '@/components/shelters/ShelterTypeFilter'
import ShelterSearch from '@/components/shelters/ShelterSearch'
import LocationDetector from '@/components/LocationDetector'
import { Button } from '@/components/ui/button'

export default function Shelters() {
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [sortByDistance, setSortByDistance] = useState(false)

  const filteredShelters = useMemo(() => {
    let result = shelters.filter(shelter => {
      // Filter by type
      if (selectedType !== 'all' && shelter.type !== selectedType) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          shelter.name.toLowerCase().includes(query) ||
          shelter.address.toLowerCase().includes(query) ||
          shelter.description?.toLowerCase().includes(query)
        )
      }

      return true
    })

    // Calculate distances if user location is available
    if (userLocation) {
      result = result.map(shelter => ({
        ...shelter,
        distance: calculateDistance(userLocation, shelter.coordinates)
      }))

      // Sort by distance if enabled
      if (sortByDistance) {
        result.sort((a, b) => a.distance - b.distance)
      }
    }

    return result
  }, [selectedType, searchQuery, userLocation, sortByDistance])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Nearby Shelters</h1>
      
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <ShelterTypeFilter
            value={selectedType}
            onChange={setSelectedType}
          />
          <ShelterSearch
            value={searchQuery}
            onChange={setSearchQuery}
          />
          {userLocation && (
            <Button
              variant="outline"
              size="sm"
              className="w-[180px]"
              onClick={() => setSortByDistance(!sortByDistance)}
            >
              {sortByDistance ? 'Clear Distance Sort' : 'Sort by Distance'}
            </Button>
          )}
        </div>
        
        <LocationDetector onLocationUpdate={setUserLocation} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredShelters.map((shelter) => (
          <ShelterCard
            key={shelter.id}
            shelter={shelter}
            distance={shelter.distance}
          />
        ))}
        {filteredShelters.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No shelters found matching your criteria.
          </p>
        )}
      </div>
    </div>
  )
}