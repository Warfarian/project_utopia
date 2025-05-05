import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { allRewards, rewardCategories } from '@/lib/constants/rewards'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function Shop() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedReward, setSelectedReward] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredRewards = selectedCategory === 'all'
    ? allRewards
    : allRewards.filter(reward => reward.category === selectedCategory)

  const handlePurchase = async (reward) => {
    setSelectedReward(reward)
    setDialogOpen(true)
  }

  const confirmPurchase = async () => {
    if (!selectedReward || !user) return

    try {
      const response = await fetch(`/api/users/${user.id}/rewards/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rewardId: selectedReward.id })
      })

      if (!response.ok) {
        throw new Error('Failed to purchase reward')
      }

      // Close dialog and reset selection
      setDialogOpen(false)
      setSelectedReward(null)

      // You might want to refresh user data here to update points/rewards
    } catch (error) {
      console.error('Purchase error:', error)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Rewards Shop</h1>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="font-medium">{user.points || 0} points available</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter rewards" />
          </SelectTrigger>
          <SelectContent>
            {rewardCategories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRewards.map((reward) => (
          <div key={reward.id} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{reward.icon}</span>
              <div>
                <h3 className="font-semibold">{reward.name}</h3>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span className="font-medium">{reward.points} points</span>
              </div>
              <Button
                onClick={() => handlePurchase(reward)}
                variant="outline"
                size="sm"
                disabled={!user || (user.points || 0) < reward.points}
              >
                Redeem
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to purchase this reward?</p>
            {selectedReward && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{selectedReward.icon}</span>
                  <h4 className="font-medium">{selectedReward.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                <p className="text-sm font-medium mt-2">{selectedReward.points} points</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmPurchase}>Confirm Purchase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}