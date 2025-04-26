// Mock data store
const data = {
  "users": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "joinedAt": "2024-01-01T00:00:00.000Z",
      "stats": {
        "pinsCreated": 12,
        "volunteeredHours": 24,
        "rewardsEarned": 3
      },
      "badges": [
        {
          "id": "1",
          "name": "First Pin",
          "description": "Created your first community pin",
          "icon": "📍",
          "earnedAt": "2024-01-02T00:00:00.000Z"
        },
        {
          "id": "2",
          "name": "Volunteer Hero",
          "description": "Completed 20 hours of volunteering",
          "icon": "⭐",
          "earnedAt": "2024-02-15T00:00:00.000Z"
        }
      ],
      "rewards": [
        {
          "id": "1",
          "name": "Local Cafe Voucher",
          "description": "$10 off at participating cafes",
          "points": 100,
          "status": "available"
        }
      ],
      "volunteerHistory": [
        {
          "id": "1",
          "type": "food",
          "organization": "Chennai Food Bank",
          "hours": 4,
          "date": "2024-02-15T00:00:00.000Z",
          "description": "Helped sort and distribute food packages"
        }
      ]
    }
  ],
  "pins": [
    {
      "id": "1",
      "type": "food",
      "description": "Food donation needed",
      "position": {
        "lat": 13.0827,
        "lng": 80.2707
      },
      "createdBy": "1",
      "timestamp": "2024-02-20T00:00:00.000Z"
    },
    {
      "id": "1745679578991",
      "type": "food",
      "description": "Need donations as soon as possible",
      "position": {
        "lat": 13.092145970814645,
        "lng": 80.25060113134246
      },
      "createdBy": "1",
      "timestamp": "2025-04-26T14:59:38.991Z"
    },
    {
      "id": "1745679862506",
      "type": "homeless",
      "description": "Crowd of homeless people in need of support ASAP",
      "position": {
        "lat": 13.088920611402292,
        "lng": 80.25790896317785
      },
      "createdBy": "1",
      "timestamp": "2025-04-26T15:04:22.506Z"
    }
  ],
  "shelters": [
    {
      "id": "1",
      "name": "Chennai Food Bank",
      "type": "food",
      "address": "Anna Nagar, Chennai",
      "coordinates": {
        "lat": 13.0827,
        "lng": 80.2707
      },
      "phone": "(044) 123-4567",
      "website": "https://chennaifoodbank.org",
      "hours": "Mon-Fri: 9am-5pm",
      "description": "Providing food assistance to those in need."
    },
    {
      "id": "2",
      "name": "Hope Shelter Chennai",
      "type": "homeless",
      "address": "T Nagar, Chennai",
      "coordinates": {
        "lat": 13.0418,
        "lng": 80.2341
      },
      "phone": "(044) 234-5678",
      "hours": "24/7",
      "description": "Emergency shelter providing beds and meals."
    }
  ]
}

module.exports = data
