# System Design - LastMile Delivery Tracker

## 1. Rate Calculation Engine
The rate calculation engine works in 4 steps:
- **Zone Detection:** Pickup and drop areas are mapped to zones via the areas table. Each area has a zone_id foreign key.
- **Volumetric Weight:** Calculated as L x B x H / 5000. Billed weight = max(actual, volumetric).
- **Rate Card Lookup:** System finds the matching rate card using pickup zone, drop zone, and order type (B2B/B2C). All rates are admin-configurable with no hardcoding.
- **COD Surcharge:** If payment type is COD, the surcharge from the rate card is added to the final charge.

## 2. Zone Detection Approach
- Every area belongs to a zone (stored in areas.zone_id).
- On order creation, the system queries the zone_id for both pickup and drop areas.
- These zone IDs are used to find the correct rate card from the rate_cards table.
- Zone management is fully dynamic, admin can create zones and assign areas anytime.

## 3. Auto-Assignment Logic
- On auto-assign trigger, system fetches all available agents in the pickup zone.
- Haversine formula calculates distance between agent lat/lng and pickup location.
- Nearest available agent is selected and assigned to the order.
- Agent is_available flag is set to false after assignment.
- On Delivered or Failed, agent is marked available again.

## 4. Failed Delivery Handling
- Agent marks order status as Failed via agent dashboard.
- System marks agent as available again automatically.
- Customer receives email notification about failed delivery.
- Customer can reschedule by selecting a new date.
- On reschedule, order status changes to Rescheduled and admin can reassign agent.
- Full history preserved in tracking_logs with immutable timestamps.