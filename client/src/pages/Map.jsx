import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import AddPinDialog from '@/components/AddPinDialog'
import { PinType, pinIcons } from '@/lib/constants'
import LocationDetector from '@/components/LocationDetector'
import { calculateDistance } from '@/lib/utils/haversine'
import { shelters } from '@/lib/constants/shelters'
import { useAuth } from '@/context/AuthContext'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapEvents({ onMapClick }) {
  const map = useMapEvents({
    click: (e) => onMapClick(e.latlng),
  })
  return null
}

export default function Map() {
  const { user: authUser } = useAuth()
  const [pins, setPins] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch pins on mount
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('/api/pins', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch pins')
        }

        const data = await response.json()
        setPins(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPins()
  }, [])

  const handleMapClick = (latlng) => {
    setSelectedPosition(latlng)
    setDialogOpen(true)
  }

  const findNearestShelter = (position, type) => {
    const relevantShelters = shelters.filter(s => s.type === type)
    if (relevantShelters.length === 0) return null

    return relevantShelters.reduce((nearest, shelter) => {
      const distance = calculateDistance(position, shelter.coordinates)
      if (!nearest || distance < nearest.distance) {
        return { ...shelter, distance }
      }
      return nearest
    }, null)
  }

  const handleAddPin = async ({ type, description }) => {
    if (!selectedPosition || !authUser) return

    const newPin = {
      type,
      description,
      position: {
        lat: selectedPosition.lat,
        lng: selectedPosition.lng
      },
      createdBy: authUser.id,
      timestamp: new Date()
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPin),
      })

      if (!response.ok) throw new Error('Failed to create pin')
      
      const createdPin = await response.json()
      setPins(prevPins => [...prevPins, createdPin])
      setDialogOpen(false)
      setSelectedPosition(null)

      // Find nearest relevant shelter
      const nearestShelter = findNearestShelter(newPin.position, type)
      if (nearestShelter) {
        // Construct email content
        const subject = `New ${type} assistance needed near ${nearestShelter.name}`
        const body = `Hello,

A new ${type} assistance request has been reported near your location:

Location: ${newPin.position.lat}, ${newPin.position.lng}
Google Maps: https://www.google.com/maps?q=${newPin.position.lat},${newPin.position.lng}
Distance from your shelter: ${nearestShelter.distance.toFixed(2)} km

Description: ${description}

This pin was created through Project Utopia.`

        // Open Gmail compose window
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1` +
          `&to=${encodeURIComponent(nearestShelter.email)}` +
          `&su=${encodeURIComponent(subject)}` +
          `&body=${encodeURIComponent(body)}`
        
        window.open(gmailUrl, '_blank')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return (
      <div className="container py-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  const defaultCenter = [13.0827, 80.2707] // Chennai

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Community Map</h1>
      <div className="mb-4">
        <LocationDetector onLocationUpdate={setUserLocation} />
      </div>
      <div className="h-[600px] rounded-lg overflow-hidden border">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
          zoom={13}
          className="h-full w-full"
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMapClick={handleMapClick} />
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.position.lat, pin.position.lng]}
              icon={new L.Icon(pinIcons[pin.type])}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-semibold mb-1">
                    {pin.type === PinType.FOOD && 'Food Donation'}
                    {pin.type === PinType.HOMELESS && 'Homeless Support'}
                    {pin.type === PinType.ANIMAL && 'Animal Assistance'}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{pin.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {new Date(pin.timestamp).toLocaleString()}
                  </div>
                  {pin.createdBy?.name && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Added by {pin.createdBy.name}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <AddPinDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        position={selectedPosition}
        onSubmit={handleAddPin}
      />
    </div>
  )
}