import { KPI_MULTIPLIER_RULE, KPI_WEIGHT_CONFIG } from "@/data/configData";

function safeNumber(value) {
  return Number(value) || 0;
}

export function calculateFinalScore(record, weightsByRole = KPI_WEIGHT_CONFIG) {
  const weights = weightsByRole[record.role] || weightsByRole.Sales;
  const totalWeight = Object.values(weights).reduce((acc, value) => acc + value, 0);

  if (!totalWeight) return 0;

  const score =
    safeNumber(record.achievementScore) * (weights.achievementScore || 0) +
    safeNumber(record.collectionScore) * (weights.collectionScore || 0) +
    safeNumber(record.costMarginScore) * (weights.costMarginScore || 0) +
    safeNumber(record.qualityScore) * (weights.qualityScore || 0) +
    safeNumber(record.timelineScore) * (weights.timelineScore || 0);

  return score / totalWeight;
}

export function getMultiplier(score, multiplierRule = KPI_MULTIPLIER_RULE) {
  const value = safeNumber(score);
  const match = multiplierRule.find((item) => value >= item.min && value <= item.max);
  return match ? match.multiplier : 0;
}

export function calculateKpiFields(record, options = {}) {
  const finalScore = calculateFinalScore(record, options.weightsByRole);
  const multiplier = getMultiplier(finalScore, options.multiplierRule);
  const baseIncentive = safeNumber(record.baseIncentive);

  return {
    ...record,
    finalScore,
    multiplier,
    finalIncentive: baseIncentive * multiplier,
  };
}
