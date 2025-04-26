import { Button } from '@/components/ui/button'

export default function RewardCard({ reward, onRedeem }) {
  const isAvailable = reward.status === 'available'

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{reward.name}</h3>
        <p className="text-sm text-muted-foreground">{reward.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">⭐</span>
          <span className="font-medium">{reward.points} points</span>
        </div>
        {isAvailable ? (
          <Button
            onClick={() => onRedeem(reward)}
            variant="outline"
            size="sm"
          >
            Redeem
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground">
            Redeemed on {reward.redeemedAt.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  )
}