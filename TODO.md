# Event Icons Enhancement

## Tasks
- [ ] Add more icons to iconMap in Events.tsx
- [ ] Add icon selection field to EventsManager.tsx admin panel
- [ ] Update form data and submission logic for icon field
- [ ] Test icon display in frontend
- [ ] Verify admin panel icon selection works

## Information Gathered
- event_create table has icon column (VARCHAR(50) DEFAULT 'Trophy')
- Current iconMap in Events.tsx: Trophy, Star, Zap, Users
- Admin panel EventsManager.tsx needs icon selection field

## Plan
1. Expand iconMap with additional Lucide icons (Sword, Shield, Crown, Heart, Target, etc.)
2. Add icon Select field to EventsManager form
3. Update form state and submission to include icon
4. Ensure database operations handle icon field
