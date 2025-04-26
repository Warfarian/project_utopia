import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShelterType } from '@/lib/constants/shelters'

export default function ShelterTypeFilter({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value={ShelterType.FOOD}>Food Banks</SelectItem>
        <SelectItem value={ShelterType.HOMELESS}>Homeless Shelters</SelectItem>
        <SelectItem value={ShelterType.ANIMAL}>Animal Shelters</SelectItem>
      </SelectContent>
    </Select>
  )
}