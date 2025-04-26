import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ShelterType } from '@/lib/constants/shelters'

export default function VolunteerForm({ open, onOpenChange, onSubmit }) {
  const [type, setType] = useState('')
  const [organization, setOrganization] = useState('')
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    onSubmit({
      type,
      organization,
      hours: Number(hours),
      description,
      date: new Date(),
    })
    
    // Reset form
    setType('')
    setOrganization('')
    setHours('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Volunteer Activity</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Activity Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ShelterType.FOOD}>Food Bank</SelectItem>
                <SelectItem value={ShelterType.HOMELESS}>Homeless Shelter</SelectItem>
                <SelectItem value={ShelterType.ANIMAL}>Animal Shelter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="organization" className="text-sm font-medium">
              Organization
            </label>
            <Input
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Organization name"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="hours" className="text-sm font-medium">
              Hours
            </label>
            <Input
              id="hours"
              type="number"
              min="0"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Number of hours"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your volunteer activities..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!type || !organization || !hours || !description}
          >
            Log Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}