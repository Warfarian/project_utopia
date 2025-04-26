# Project Utopia Knowledge Base

## Map Features
- Using React-Leaflet for map integration
- Custom markers for different pin types (food, homeless, animal)
- Backend API integration for pin storage
- Click handling for pin placement
- User location detection for map centering
- Pins show creator name and timestamp

## Shelter Features
- Distance calculation using Haversine formula
- Browser geolocation for user position
- Filtering by type and search
- Sort by distance from user
- Map integration with Google Maps links

## Profile Features
- User stats tracking (pins, volunteer hours, rewards)
- Badge system for achievements
- Reward redemption with confirmation
- Volunteer activity logging and timeline
- Local state management (temporary)

## UI Components
- Using ShadcnUI components
- Custom components:
  - `AddPinDialog`: Dialog for adding new pins
  - Map markers with type-specific icons and popups
  - `LocationDetector`: Manages browser geolocation
  - `ShelterCard`: Display shelter info with distance
  - `RewardCard`: Display and manage reward redemption
  - `VolunteerForm`: Log volunteer activities

## Backend Integration
- REST API endpoints for pins, shelters, users
- In-memory data storage (temporary)
- CORS enabled for local development
- Basic error handling