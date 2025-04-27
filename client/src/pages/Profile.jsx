import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import UserStats from '@/components/profile/UserStats'
import BadgeGrid from '@/components/profile/BadgeGrid'
import ActivityTimeline from '@/components/profile/ActivityTimeline'
import RewardsSection from '@/components/profile/RewardsSection'
import VolunteerForm from '@/components/profile/VolunteerForm'
import { Button } from '@/components/ui/button'

export default function Profile() {
  const location = useLocation()
  const { user: authUser } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [volunteerFormOpen, setVolunteerFormOpen] = useState(false)

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token || !authUser) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/users/${authUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const data = await response.json()
      setUser(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [location])

  const handleRedeemReward = async (reward) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/users/${user.id}/rewards/${reward.id}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to redeem reward')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddVolunteerActivity = async (activity) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`/api/users/${user.id}/volunteer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      })

      if (!response.ok) {
        throw new Error('Failed to add volunteer activity')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setVolunteerFormOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8">
        <p className="text-destructive">User profile not found</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl font-semibold text-primary">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">Member since {new Date(user.joinedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Stats</h2>
          <UserStats stats={user.stats} />
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Badges</h2>
          <BadgeGrid badges={user.badges} />
        </div>

        {/* Rewards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Rewards</h2>
          <RewardsSection
            rewards={user.rewards}
            onRedeemReward={handleRedeemReward}
          />
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button
              variant="outline"
              onClick={() => setVolunteerFormOpen(true)}
            >
              Log Volunteer Hours
            </Button>
          </div>
          <ActivityTimeline activities={user.volunteerHistory} />
        </div>
      </div>

      <VolunteerForm
        open={volunteerFormOpen}
        onOpenChange={setVolunteerFormOpen}
        onSubmit={handleAddVolunteerActivity}
      />
    </div>
  )
}