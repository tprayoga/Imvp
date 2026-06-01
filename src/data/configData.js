export const PROJECT_TYPE_CONFIG = [
  {
    type: "Infrastructure IT",
    marginGate: { standard: 12, good: 20, excellent: 28 },
    bonusPoolByTier: { "Below Gate": 0, Standard: 10, Good: 14, Excellent: 18 },
  },
  {
    type: "Software Development",
    marginGate: { standard: 15, good: 24, excellent: 32 },
    bonusPoolByTier: { "Below Gate": 0, Standard: 11, Good: 16, Excellent: 20 },
  },
  {
    type: "Managed Service",
    marginGate: { standard: 10, good: 18, excellent: 26 },
    bonusPoolByTier: { "Below Gate": 0, Standard: 9, Good: 13, Excellent: 17 },
  },
  {
    type: "Telco / Network",
    marginGate: { standard: 11, good: 19, excellent: 27 },
    bonusPoolByTier: { "Below Gate": 0, Standard: 10, Good: 14, Excellent: 18 },
  },
  {
    type: "Training / Consulting",
    marginGate: { standard: 20, good: 30, excellent: 40 },
    bonusPoolByTier: { "Below Gate": 0, Standard: 12, Good: 18, Excellent: 24 },
  },
];

export const COLLECTION_GATES = [
  { min: 0, max: 49.99, paidPercentage: 0 },
  { min: 50, max: 69.99, paidPercentage: 40 },
  { min: 70, max: 89.99, paidPercentage: 70 },
  { min: 90, max: 100, paidPercentage: 100 },
];

export const ROLE_SHARE_CONFIG = {
  Standard: {
    Sales: 60,
    Purchasing: 8,
    "Tech / Implementation": 20,
    "PM / Ops": 12,
  },
  Good: {
    Sales: 65,
    Purchasing: 7,
    "Tech / Implementation": 18,
    "PM / Ops": 10,
  },
  Excellent: {
    Sales: 70,
    Purchasing: 6,
    "Tech / Implementation": 16,
    "PM / Ops": 8,
  },
  "Below Gate": {
    Sales: 0,
    Purchasing: 0,
    "Tech / Implementation": 0,
    "PM / Ops": 0,
  },
};

export const KPI_WEIGHT_CONFIG = {
  Sales: {
    achievementScore: 40,
    collectionScore: 30,
    costMarginScore: 20,
    qualityScore: 10,
    timelineScore: 0,
  },
  Purchasing: {
    achievementScore: 35,
    collectionScore: 25,
    costMarginScore: 20,
    qualityScore: 0,
    timelineScore: 20,
  },
  "Tech / Implementation": {
    achievementScore: 35,
    collectionScore: 25,
    costMarginScore: 20,
    qualityScore: 20,
    timelineScore: 0,
  },
  "PM / Ops": {
    achievementScore: 30,
    collectionScore: 25,
    costMarginScore: 20,
    qualityScore: 25,
    timelineScore: 0,
  },
};

export const KPI_MULTIPLIER_RULE = [
  { min: 0, max: 59.99, multiplier: 0 },
  { min: 60, max: 79.99, multiplier: 0.8 },
  { min: 80, max: 89.99, multiplier: 1 },
  { min: 90, max: 99.99, multiplier: 1.2 },
  { min: 100, max: Number.POSITIVE_INFINITY, multiplier: 1.5 },
];

export const EMPLOYEE_INCENTIVE_THRESHOLD = {
  minimumFinalScore: 70,
  minimumTargetAchievement: 85,
};

export const CALCULATION_STATUS = [
  "Draft",
  "Calculated",
  "Submitted",
  "Finance Reviewed",
  "Pending Management Approval",
  "Approved",
  "Paid",
  "Rejected",
  "Revision Needed",
];
