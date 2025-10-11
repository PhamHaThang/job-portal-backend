const getTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};
const getTimeRanges = (days = 7) => {
  const now = new Date();
  const lastPeriodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const prevPeriodStart = new Date(
    now.getTime() - 2 * days * 24 * 60 * 60 * 1000
  );
  return { now, lastPeriodStart, prevPeriodStart };
};
module.exports = { getTrend, getTimeRanges };
