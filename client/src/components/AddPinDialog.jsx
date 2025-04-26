import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PinType } from '@/lib/constants'

export default function AddPinDialog({ open, onOpenChange, position, onSubmit }) {
  const [type, setType] = useState(PinType.FOOD)
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    onSubmit({ type, description, position })
    setType(PinType.FOOD)
    setDescription('')
  }

  const handleOpenChange = (open) => {
    if (!open) {
      setType(PinType.FOOD)
      setDescription('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Pin</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue>
                  {type === PinType.FOOD && 'Food Donation'}
                  {type === PinType.HOMELESS && 'Homeless Support'}
                  {type === PinType.ANIMAL && 'Animal Assistance'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PinType.FOOD}>Food Donation</SelectItem>
                <SelectItem value={PinType.HOMELESS}>Homeless Support</SelectItem>
                <SelectItem value={PinType.ANIMAL}>Animal Assistance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the situation..."
            />
          </div>
          {position && (
            <p className="text-xs text-muted-foreground">
              Location: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!type || !description}>
            Add Pin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}