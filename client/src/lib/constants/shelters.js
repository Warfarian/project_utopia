export const ShelterType = {
  FOOD: 'food',
  HOMELESS: 'homeless',
  ANIMAL: 'animal',
}

// Sample shelter data (to be replaced with API data later)
export const shelters = [
  {
    id: '1',
    name: 'Chennai Food Bank',
    type: ShelterType.FOOD,
    address: 'Anna Nagar, Chennai',
    coordinates: {
      lat: 13.0827,
      lng: 80.2707,
    },
    phone: '(044) 123-4567',
    website: 'https://chennaifoodbank.org',
    hours: 'Mon-Fri: 9am-5pm',
    description: 'Providing food assistance to those in need. We accept donations and distribute food packages daily.',
  },
  {
    id: '2',
    name: 'Hope Shelter Chennai',
    type: ShelterType.HOMELESS,
    address: 'T Nagar, Chennai',
    coordinates: {
      lat: 13.0418,
      lng: 80.2341,
    },
    phone: '(044) 234-5678',
    hours: '24/7',
    description: 'Emergency shelter providing beds, meals, and support services.',
  },
  {
    id: '3',
    name: 'Blue Cross Chennai',
    type: ShelterType.ANIMAL,
    address: 'Velachery, Chennai',
    coordinates: {
      lat: 12.9815,
      lng: 80.2180,
    },
    phone: '(044) 345-6789',
    website: 'https://bluecross.org',
    hours: 'Tue-Sun: 10am-6pm',
    description: 'Animal shelter offering adoption services and veterinary care.',
  },
  {
    id: '4',
    name: 'Chennai Food Pantry',
    type: ShelterType.FOOD,
    address: 'Adyar, Chennai',
    coordinates: {
      lat: 13.0012,
      lng: 80.2565,
    },
    phone: '(044) 456-7890',
    hours: 'Mon-Sat: 8am-8pm',
    description: 'Food pantry serving fresh and non-perishable items to families in need.',
  },
  {
    id: '5',
    name: 'Safe Haven Chennai',
    type: ShelterType.HOMELESS,
    address: 'Mylapore, Chennai',
    coordinates: {
      lat: 13.0369,
      lng: 80.2676,
    },
    phone: '(044) 567-8901',
    website: 'https://safehaven.org',
    hours: '24/7',
    description: 'Transitional housing and support services for individuals experiencing homelessness.',
  },
  {
    id: '6',
    name: 'Pet Sanctuary Chennai',
    type: ShelterType.ANIMAL,
    address: 'Besant Nagar, Chennai',
    coordinates: {
      lat: 13.0002,
      lng: 80.2668,
    },
    phone: '(044) 678-9012',
    website: 'https://petsanctuary.org',
    hours: 'Wed-Mon: 11am-7pm',
    description: 'Animal shelter specializing in cat and dog adoption, fostering, and rehabilitation.',
  },
]