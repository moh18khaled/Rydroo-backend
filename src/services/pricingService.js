export const estimateFare = ({ distanceMeters, durationSeconds }) => {
  const base = 2.5;
  const perKm = 1.2;
  const perMinute = 0.2;
  return Math.max(3, base + (distanceMeters/1000) * perKm + (durationSeconds/60) * perMinute);
};

export default { estimateFare };