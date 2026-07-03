function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function findNearestAgent(agents, pickupLat, pickupLng) {
  const available = agents.filter(a => a.is_available);
  if (!available.length) return null;
  return available.sort((a, b) =>
    haversine(pickupLat, pickupLng, a.lat, a.lng) -
    haversine(pickupLat, pickupLng, b.lat, b.lng)
  )[0];
}

module.exports = { findNearestAgent };