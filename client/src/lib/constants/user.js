// Mock user data (to be replaced with API data later)
export const currentUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  joinedAt: new Date('2024-01-01'),
  stats: {
    pinsCreated: 12,
    volunteeredHours: 24,
    rewardsEarned: 3
  },
  badges: [
    {
      id: '1',
      name: 'First Pin',
      description: 'Created your first community pin',
      icon: '📍',
      earnedAt: new Date('2024-01-02')
    },
    {
      id: '2',
      name: 'Volunteer Hero',
      description: 'Completed 20 hours of volunteering',
      icon: '⭐',
      earnedAt: new Date('2024-02-15')
    },
    {
      id: '3',
      name: 'Food Champion',
      description: 'Helped distribute food to 50+ people',
      icon: '🥘',
      earnedAt: new Date('2024-02-20')
    },
    {
      id: '4',
      name: 'Animal Friend',
      description: 'Volunteered at animal shelters for 10+ hours',
      icon: '🐾',
      earnedAt: new Date('2024-02-25')
    },
    {
      id: '5',
      name: 'Community Builder',
      description: 'Created 10+ community pins',
      icon: '🏗️',
      earnedAt: new Date('2024-03-01')
    },
    {
      id: '6',
      name: 'Helping Hand',
      description: 'Assisted at homeless shelters for 15+ hours',
      icon: '🤝',
      earnedAt: new Date('2024-03-05')
    }
  ],
  rewards: [
    {
      id: '1',
      name: 'Local Cafe Voucher',
      description: '$10 off at participating cafes',
      points: 100,
      status: 'available'
    },
    {
      id: '2',
      name: 'Movie Tickets',
      description: 'Two free movie tickets',
      points: 250,
      status: 'redeemed',
      redeemedAt: new Date('2024-02-01')
    },
    {
      id: '3',
      name: 'Amazon Gift Card',
      description: '$25 Amazon gift card',
      points: 300,
      status: 'available'
    },
    {
      id: '4',
      name: 'Cinema Voucher',
      description: 'Buy one get one free movie ticket',
      points: 150,
      status: 'available'
    },
    {
      id: '5',
      name: 'Grocery Store Coupon',
      description: '$20 off at local grocery stores',
      points: 200,
      status: 'available'
    },
    {
      id: '6',
      name: 'Restaurant Discount',
      description: '30% off at selected restaurants',
      points: 275,
      status: 'available'
    }
  ],
  volunteerHistory: [
    {
      id: '1',
      type: 'food',
      organization: 'Community Food Bank',
      hours: 4,
      date: new Date('2024-02-15'),
      description: 'Helped sort and distribute food packages'
    },
    {
      id: '2',
      type: 'animal',
      organization: 'Paws Animal Rescue',
      hours: 6,
      date: new Date('2024-02-10'),
      description: 'Assisted with dog walking and kennel cleaning'
    },
    {
      id: '3',
      type: 'homeless',
      organization: 'Hope Homeless Shelter',
      hours: 8,
      date: new Date('2024-02-01'),
      description: 'Served meals and helped organize donations'
    }
  ]
}