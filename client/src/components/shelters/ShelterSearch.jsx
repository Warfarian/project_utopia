import { Input } from '@/components/ui/input'

export default function ShelterSearch({ value, onChange }) {
  return (
    <Input
      type="search"
      placeholder="Search shelters..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  )
}