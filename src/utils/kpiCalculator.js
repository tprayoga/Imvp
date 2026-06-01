import {
  EMPLOYEE_INCENTIVE_THRESHOLD,
  KPI_MULTIPLIER_RULE,
  KPI_WEIGHT_CONFIG,
} from "@/data/configData";

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

export function calculateTargetAchievement(record) {
  const target = safeNumber(record.targetValue);
  const actual = safeNumber(record.actualValue);
  if (target <= 0) return 0;
  return (actual / target) * 100;
}

export function calculateKpiFields(record, options = {}) {
  const finalScore = calculateFinalScore(record, options.weightsByRole);
  const multiplier = getMultiplier(finalScore, options.multiplierRule);
  const baseIncentive = safeNumber(record.baseIncentive);
  const targetAchievement = calculateTargetAchievement(record);
  const threshold = options.thresholdConfig || EMPLOYEE_INCENTIVE_THRESHOLD;
  const eligibleForIncentive =
    finalScore >= safeNumber(threshold.minimumFinalScore) &&
    targetAchievement >= safeNumber(threshold.minimumTargetAchievement);
  const finalIncentive = eligibleForIncentive ? baseIncentive * multiplier : 0;

  return {
    ...record,
    finalScore,
    multiplier,
    targetAchievement,
    eligibleForIncentive,
    finalIncentive,
  };
}
