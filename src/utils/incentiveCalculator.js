import {
  COLLECTION_GATES,
  PROJECT_TYPE_CONFIG,
  ROLE_SHARE_CONFIG,
} from "@/data/configData";

function safeNumber(value) {
  return Number(value) || 0;
}

export function getProjectTypeConfig(projectType, masterProjectTypes = []) {
  const source = masterProjectTypes.length ? masterProjectTypes : PROJECT_TYPE_CONFIG;
  return source.find((item) => item.type === projectType) || PROJECT_TYPE_CONFIG[0];
}

export function getTier(marginPercentage, projectType, masterProjectTypes = []) {
  const cfg = getProjectTypeConfig(projectType, masterProjectTypes);
  if (!cfg) return "Below Gate";

  const margin = safeNumber(marginPercentage);
  if (margin >= cfg.marginGate.excellent) return "Excellent";
  if (margin >= cfg.marginGate.good) return "Good";
  if (margin >= cfg.marginGate.standard) return "Standard";
  return "Below Gate";
}

export function getPaidPercentage(collectionRatio, collectionGate = COLLECTION_GATES) {
  const ratio = safeNumber(collectionRatio);
  if (ratio >= 100) {
    const maxGate = collectionGate.reduce(
      (best, current) => (current.paidPercentage > best.paidPercentage ? current : best),
      collectionGate[0]
    );
    return maxGate?.paidPercentage || 0;
  }
  const gate = collectionGate.find((item) => ratio >= item.min && ratio <= item.max);
  return gate ? gate.paidPercentage : 0;
}

export function calculateProjectFinancials(project, options = {}) {
  const revenue = safeNumber(project.revenue);
  const cost = safeNumber(project.cost);
  const collectedAmount = safeNumber(project.collectedAmount);
  const grossProfit = revenue - cost;
  const eligibleGrossProfit = Math.max(0, grossProfit);
  const marginPercentage = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const collectionRatio = revenue > 0 ? (collectedAmount / revenue) * 100 : 0;

  const tier = getTier(marginPercentage, project.projectType, options.projectTypeConfig);
  const typeCfg = getProjectTypeConfig(project.projectType, options.projectTypeConfig);
  const bonusPoolPercentage = typeCfg?.bonusPoolByTier?.[tier] ?? 0;
  const bonusPoolAmount = (eligibleGrossProfit * bonusPoolPercentage) / 100;

  const paidPercentage = getPaidPercentage(collectionRatio, options.collectionGates);
  const paidIncentiveAmount = (bonusPoolAmount * paidPercentage) / 100;
  const lockedIncentiveAmount = bonusPoolAmount - paidIncentiveAmount;

  return {
    ...project,
    grossProfit,
    marginPercentage,
    collectionRatio,
    tier,
    bonusPoolPercentage,
    bonusPoolAmount,
    paidPercentage,
    paidIncentiveAmount,
    lockedIncentiveAmount,
  };
}

export function roleShareForTier(tier, roleShareConfig = ROLE_SHARE_CONFIG) {
  return roleShareConfig[tier] || roleShareConfig.Standard;
}

export function distributeRolePool(paidIncentiveAmount, tier, roleShareConfig = ROLE_SHARE_CONFIG) {
  const share = roleShareForTier(tier, roleShareConfig);
  const amount = safeNumber(paidIncentiveAmount);

  return Object.entries(share).reduce((acc, [role, percentage]) => {
    acc[role] = (amount * percentage) / 100;
    return acc;
  }, {});
}

export function normalizeIncentives(kpis, paidIncentiveAmount) {
  const sum = kpis.reduce((acc, item) => acc + safeNumber(item.finalIncentive), 0);
  if (!sum || sum <= paidIncentiveAmount) return kpis;

  const scale = paidIncentiveAmount / sum;
  return kpis.map((item) => ({
    ...item,
    finalIncentive: safeNumber(item.finalIncentive) * scale,
    normalized: true,
  }));
}
