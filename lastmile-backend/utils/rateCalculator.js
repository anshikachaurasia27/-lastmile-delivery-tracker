function calculateCharge({ L, B, H, actualWeight, orderType, paymentType, pickupZone, dropZone, rateCards }) {
  const volumetricWeight = (L * B * H) / 5000;
  const billedWeight = Math.max(actualWeight, volumetricWeight);

  const card = rateCards.find(r =>
    parseInt(r.zone_from) === parseInt(pickupZone) &&
    parseInt(r.zone_to) === parseInt(dropZone) &&
    r.order_type === orderType
  );

  if (!card) throw new Error('Rate card not found for this zone combination');

  let charge = billedWeight * parseFloat(card.rate_per_kg);
  if (paymentType === 'COD') charge += parseFloat(card.cod_surcharge);

  return { volumetricWeight, billedWeight, charge };
}

module.exports = { calculateCharge };