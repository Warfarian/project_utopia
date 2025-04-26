import { useState } from 'react'
import { currentUser } from '@/lib/constants/user'
import UserStats from '@/components/profile/UserStats'
import BadgeGrid from '@/components/profile/BadgeGrid'
import ActivityTimeline from '@/components/profile/ActivityTimeline'
import RewardsSection from '@/components/profile/RewardsSection'
import VolunteerForm from '@/components/profile/VolunteerForm'
import { Button } from '@/components/ui/button'

export default function Profile() {
  const [user, setUser] = useState(currentUser)
  const [volunteerFormOpen, setVolunteerFormOpen] = useState(false)

  const handleRedeemReward = (reward) => {
    // Update the reward status
    const updatedRewards = user.rewards.map(r => {
      if (r.id === reward.id) {
        return {
          ...r,
          status: 'redeemed',
          redeemedAt: new Date()
        }
      }
      return r
    })

    // Update user stats
    const updatedStats = {
      ...user.stats,
      rewardsEarned: user.stats.rewardsEarned + 1
    }

    // Update user state
    setUser({
      ...user,
      rewards: updatedRewards,
      stats: updatedStats
    })
  }

  const handleAddVolunteerActivity = (activity) => {
    // Create new activity with ID
    const newActivity = {
      id: Date.now().toString(),
      ...activity
    }

    // Update volunteer history
    const updatedHistory = [newActivity, ...user.volunteerHistory]

    // Update user stats
    const updatedStats = {
      ...user.stats,
      volunteeredHours: user.stats.volunteeredHours + activity.hours
    }

    // Update user state
    setUser({
      ...user,
      volunteerHistory: updatedHistory,
      stats: updatedStats
    })

    // Close the form
    setVolunteerFormOpen(false)
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
            <p className="text-muted-foreground">Member since {user.joinedAt.toLocaleDateString()}</p>
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