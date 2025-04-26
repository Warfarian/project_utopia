import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import RewardCard from './RewardCard'

export default function RewardsSection({ rewards, onRedeemReward }) {
  const [selectedReward, setSelectedReward] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRedeem = (reward) => {
    setSelectedReward(reward)
    setDialogOpen(true)
  }

  const confirmRedeem = () => {
    if (selectedReward) {
      onRedeemReward(selectedReward)
      setDialogOpen(false)
      setSelectedReward(null)
    }
  }

  const availableRewards = rewards.filter(r => r.status === 'available')
  const redeemedRewards = rewards.filter(r => r.status === 'redeemed')

  return (
    <>
      {/* Available Rewards */}
      {availableRewards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Rewards</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {availableRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                onRedeem={handleRedeem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Redeemed Rewards */}
      {redeemedRewards.length > 0 && (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold">Redeemed Rewards</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {redeemedRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
              />
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to redeem this reward?</p>
            {selectedReward && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">{selectedReward.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedReward.description}</p>
                <p className="text-sm font-medium mt-2">{selectedReward.points} points</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmRedeem}>Confirm Redeem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}