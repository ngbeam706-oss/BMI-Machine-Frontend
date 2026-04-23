// Static seed data for Mayurah Hospitals
export type Gender = "Male" | "Female";
export type ScanStatus = "Normal" | "Attention" | "Critical";
export type DeviceStatus = "Online" | "Offline" | "Syncing" | "Maintenance";
export type RangeStatus = "Insufficient" | "Standard" | "Excellent" | "High" | "High Risk";

export interface Branch {
  id: string;
  name: string;
  city: string;
  state: string;
  contact: string;
  email: string;
  manager: string;
  deviceCount: number;
  todayScans: number;
  weeklyScans: number;
  totalPatients: number;
  performance: number; // 0-100
}

export interface Device {
  id: string;
  model: string;
  serial: string;
  branchId: string;
  status: DeviceStatus;
  lastSync: string; // ISO
  totalScans: number;
  technician: string;
  firmware: string;
  uptime: number; // %
}

export interface Measurement {
  // Basic
  weight: number;
  standardWeight: number;
  bmi: number;
  bodyAge: number;
  bodyType: string;
  // Muscle
  skeletalMuscleMass: number;
  skeletalMuscleRatio: number;
  smqi: number;
  muscleMass: number;
  muscleRate: number;
  trunkMuscleMass: number;
  trunkMuscleRate: number;
  leftArmMuscleMass: number;
  rightArmMuscleMass: number;
  leftLegMuscleMass: number;
  rightLegMuscleMass: number;
  leftArmMuscleRate: number;
  rightArmMuscleRate: number;
  leftLegMuscleRate: number;
  rightLegMuscleRate: number;
  muscleControl: number;
  // Fat
  fatMass: number;
  fatRatio: number;
  subcutaneousFatMass: number;
  subcutaneousFatRatio: number;
  trunkFatMass: number;
  trunkFatPercentage: number;
  leftArmFatMass: number;
  rightArmFatMass: number;
  leftLegFatMass: number;
  rightLegFatMass: number;
  leftArmFatRatio: number;
  rightArmFatRatio: number;
  leftLegFatRatio: number;
  rightLegFatRatio: number;
  visceralFat: number;
  fatControl: number;
  obesityLevel: string;
  obesityDegree: number;
  // Water/Protein/Mineral
  totalBodyWater: number;
  waterRatio: number;
  intracellularWater: number;
  extracellularWater: number;
  proteinMass: number;
  proteinRatio: number;
  minerals: number;
  boneMass: number;
  bodyCellMass: number;
  fatFreeMass: number;
  // Metabolic
  bmr: number;
  recommendedCalories: number;
  healthEvaluation: string;
  healthScore: number;
  weightControl: number;
  waistHipRatio: number;
  // Impedance
  impedance: {
    f20: { leftArm: number; rightArm: number; leftLeg: number; rightLeg: number; trunk: number };
    f100: { leftArm: number; rightArm: number; leftLeg: number; rightLeg: number; trunk: number };
  };
  dynamicStandards?: any;
}

export interface Scan {
  id: string;
  patientId: string;
  branchId: string;
  deviceId: string;
  timestamp: string; // ISO
  status: ScanStatus;
  measurement: Measurement;
}

export interface Patient {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  height: number; // cm
  phone: string;
  email: string;
  primaryBranchId: string;
  registeredOn: string;
  lastScanId: string;
}

// ---------- Branches ----------
export const branches: Branch[] = [
  { id: "BR-001", name: "Mayurah Central — Bengaluru", city: "Bengaluru", state: "Karnataka", contact: "+91 80 4567 1100", email: "central@mayurah.in", manager: "Dr. Anitha Rao", deviceCount: 6, todayScans: 42, weeklyScans: 286, totalPatients: 4820, performance: 94 },
  { id: "BR-002", name: "Mayurah HSR Layout", city: "Bengaluru", state: "Karnataka", contact: "+91 80 4567 1200", email: "hsr@mayurah.in", manager: "Dr. Vikram Shetty", deviceCount: 4, todayScans: 28, weeklyScans: 192, totalPatients: 2940, performance: 88 },
  { id: "BR-003", name: "Mayurah Whitefield", city: "Bengaluru", state: "Karnataka", contact: "+91 80 4567 1300", email: "whitefield@mayurah.in", manager: "Dr. Priya Menon", deviceCount: 5, todayScans: 36, weeklyScans: 244, totalPatients: 3680, performance: 91 },
  { id: "BR-004", name: "Mayurah Mumbai Andheri", city: "Mumbai", state: "Maharashtra", contact: "+91 22 6789 4400", email: "andheri@mayurah.in", manager: "Dr. Rajesh Iyer", deviceCount: 5, todayScans: 31, weeklyScans: 218, totalPatients: 3120, performance: 86 },
  { id: "BR-005", name: "Mayurah Chennai T.Nagar", city: "Chennai", state: "Tamil Nadu", contact: "+91 44 2345 6700", email: "chennai@mayurah.in", manager: "Dr. Lakshmi Subramanian", deviceCount: 4, todayScans: 24, weeklyScans: 168, totalPatients: 2780, performance: 83 },
  { id: "BR-006", name: "Mayurah Hyderabad Banjara Hills", city: "Hyderabad", state: "Telangana", contact: "+91 40 2345 6800", email: "hyderabad@mayurah.in", manager: "Dr. Ahmed Khan", deviceCount: 3, todayScans: 19, weeklyScans: 134, totalPatients: 2210, performance: 89 },
  { id: "BR-007", name: "Mayurah Pune Koregaon Park", city: "Pune", state: "Maharashtra", contact: "+91 20 6789 5500", email: "pune@mayurah.in", manager: "Dr. Sneha Deshmukh", deviceCount: 3, todayScans: 17, weeklyScans: 121, totalPatients: 1890, performance: 90 },
  { id: "BR-008", name: "Mayurah Delhi Saket", city: "New Delhi", state: "Delhi", contact: "+91 11 4567 8800", email: "delhi@mayurah.in", manager: "Dr. Kabir Singh", deviceCount: 4, todayScans: 22, weeklyScans: 156, totalPatients: 2640, performance: 87 },
];

// ---------- Devices ----------
const deviceModels = ["BCM-Pro 9000", "BCM-X7 Elite", "BCM-Lite 500", "InBody-Plus 770"];
const technicians = ["Ramesh K.", "Sunita P.", "Arjun M.", "Divya R.", "Faisal A.", "Neha S.", "Kiran V.", "Pooja N."];

export const devices: Device[] = (() => {
  const list: Device[] = [];
  let counter = 1;
  branches.forEach((br) => {
    for (let i = 0; i < br.deviceCount; i++) {
      const id = `DEV-${String(counter).padStart(4, "0")}`;
      const statusRoll = Math.random();
      const status: DeviceStatus = statusRoll > 0.92 ? "Offline" : statusRoll > 0.86 ? "Maintenance" : statusRoll > 0.80 ? "Syncing" : "Online";
      const lastSync = new Date(Date.now() - Math.floor(Math.random() * (status === "Offline" ? 86400000 * 3 : 3600000 * 6))).toISOString();
      list.push({
        id,
        model: deviceModels[counter % deviceModels.length],
        serial: `MYR${1000 + counter}-${br.id.split("-")[1]}`,
        branchId: br.id,
        status,
        lastSync,
        totalScans: 800 + Math.floor(Math.random() * 4200),
        technician: technicians[counter % technicians.length],
        firmware: `v${2 + (counter % 3)}.${counter % 9}.${counter % 5}`,
        uptime: 88 + Math.floor(Math.random() * 12),
      });
      counter++;
    }
  });
  return list;
})();

// ---------- Patients & Scans ----------
const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Rohan", "Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Anika", "Navya", "Kiara", "Myra", "Sara", "Rahul", "Priya", "Neha", "Vikram", "Meera", "Karthik", "Lakshmi", "Suresh", "Deepa", "Arun"];
const lastNames = ["Sharma", "Verma", "Patel", "Reddy", "Iyer", "Menon", "Nair", "Rao", "Singh", "Kapoor", "Gupta", "Chopra", "Malhotra", "Shetty", "Pillai", "Bose", "Das", "Joshi", "Khanna", "Mehta"];
const bodyTypes = ["Athletic", "Standard", "Hidden Obesity", "Lean", "Obese", "Muscular Build", "Sarcopenic Obesity"];
const obesityLevels = ["Underweight", "Normal", "Overweight", "Obese Class I", "Obese Class II"];
const evaluations = ["Healthy", "Needs Attention", "At Risk", "Excellent"];

function rand(min: number, max: number, dec = 1) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(dec));
}

function genMeasurement(gender: Gender, age: number, height: number): Measurement {
  const isMale = gender === "Male";
  const weight = rand(isMale ? 58 : 48, isMale ? 95 : 78, 1);
  const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
  const standardWeight = Number((22 * Math.pow(height / 100, 2)).toFixed(1));
  const fatRatio = isMale ? rand(12, 32) : rand(20, 38);
  const fatMass = Number((weight * fatRatio / 100).toFixed(1));
  const fatFreeMass = Number((weight - fatMass).toFixed(1));
  const muscleMass = Number((fatFreeMass * 0.84).toFixed(1));
  const skeletalMuscleMass = Number((muscleMass * 0.55).toFixed(1));
  const tbw = Number((fatFreeMass * 0.73).toFixed(1));
  const protein = Number((fatFreeMass * 0.2).toFixed(1));
  const minerals = Number((fatFreeMass * 0.06).toFixed(2));
  const bone = Number((minerals * 0.65).toFixed(2));
  const bmr = Math.round(isMale ? 88.4 + 13.4 * weight + 4.8 * height - 5.68 * age : 447.6 + 9.25 * weight + 3.10 * height - 4.33 * age);
  const visc = Math.round(rand(3, 18, 0));
  const trunkMuscle = Number((skeletalMuscleMass * 0.45).toFixed(1));
  const trunkFat = Number((fatMass * 0.5).toFixed(1));
  const armM = Number((skeletalMuscleMass * 0.06).toFixed(2));
  const legM = Number((skeletalMuscleMass * 0.16).toFixed(2));
  const armF = Number((fatMass * 0.06).toFixed(2));
  const legF = Number((fatMass * 0.18).toFixed(2));
  const healthScore = Math.max(38, Math.min(98, Math.round(85 - Math.abs(bmi - 22) * 3 - Math.max(0, visc - 9) * 2 + rand(-5, 5, 0))));

  return {
    weight, standardWeight, bmi,
    bodyAge: Math.max(18, age + Math.round(rand(-5, 8, 0))),
    bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],

    skeletalMuscleMass,
    skeletalMuscleRatio: Number(((skeletalMuscleMass / weight) * 100).toFixed(1)),
    smqi: rand(7.5, 11.5, 2),
    muscleMass,
    muscleRate: Number(((muscleMass / weight) * 100).toFixed(1)),
    trunkMuscleMass: trunkMuscle,
    trunkMuscleRate: Number(((trunkMuscle / muscleMass) * 100).toFixed(1)),
    leftArmMuscleMass: armM,
    rightArmMuscleMass: Number((armM * rand(0.96, 1.04, 3)).toFixed(2)),
    leftLegMuscleMass: legM,
    rightLegMuscleMass: Number((legM * rand(0.96, 1.04, 3)).toFixed(2)),
    leftArmMuscleRate: rand(85, 105),
    rightArmMuscleRate: rand(85, 105),
    leftLegMuscleRate: rand(88, 108),
    rightLegMuscleRate: rand(88, 108),
    muscleControl: Number(rand(-2, 5, 1)),

    fatMass, fatRatio,
    subcutaneousFatMass: Number((fatMass * 0.7).toFixed(1)),
    subcutaneousFatRatio: Number((fatRatio * 0.7).toFixed(1)),
    trunkFatMass: trunkFat,
    trunkFatPercentage: Number(((trunkFat / weight) * 100).toFixed(1)),
    leftArmFatMass: armF,
    rightArmFatMass: Number((armF * rand(0.95, 1.05, 3)).toFixed(2)),
    leftLegFatMass: legF,
    rightLegFatMass: Number((legF * rand(0.95, 1.05, 3)).toFixed(2)),
    leftArmFatRatio: rand(15, 35),
    rightArmFatRatio: rand(15, 35),
    leftLegFatRatio: rand(18, 38),
    rightLegFatRatio: rand(18, 38),
    visceralFat: visc,
    fatControl: Number(rand(-6, 4, 1)),
    obesityLevel: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : bmi < 35 ? obesityLevels[3] : obesityLevels[4],
    obesityDegree: Number(((bmi / 22) * 100).toFixed(0)),

    totalBodyWater: tbw,
    waterRatio: Number(((tbw / weight) * 100).toFixed(1)),
    intracellularWater: Number((tbw * 0.6).toFixed(1)),
    extracellularWater: Number((tbw * 0.4).toFixed(1)),
    proteinMass: protein,
    proteinRatio: Number(((protein / weight) * 100).toFixed(1)),
    minerals,
    boneMass: bone,
    bodyCellMass: Number((protein + tbw * 0.6).toFixed(1)),
    fatFreeMass,

    bmr,
    recommendedCalories: Math.round(bmr * 1.4),
    healthEvaluation: healthScore > 85 ? "Excellent" : healthScore > 70 ? "Healthy" : healthScore > 55 ? "Needs Attention" : "At Risk",
    healthScore,
    weightControl: Number((standardWeight - weight).toFixed(1)),
    waistHipRatio: rand(0.72, 1.05, 2),

    impedance: {
      f20: { leftArm: Math.round(rand(280, 420, 0)), rightArm: Math.round(rand(280, 420, 0)), leftLeg: Math.round(rand(220, 320, 0)), rightLeg: Math.round(rand(220, 320, 0)), trunk: Math.round(rand(20, 40, 0)) },
      f100: { leftArm: Math.round(rand(240, 360, 0)), rightArm: Math.round(rand(240, 360, 0)), leftLeg: Math.round(rand(190, 280, 0)), rightLeg: Math.round(rand(190, 280, 0)), trunk: Math.round(rand(18, 32, 0)) },
    },
  };
}

function genStatus(m: Measurement): ScanStatus {
  if (m.healthScore < 55 || m.visceralFat > 14 || m.bmi > 32) return "Critical";
  if (m.healthScore < 75 || m.visceralFat > 10 || m.bmi > 28 || m.bmi < 18) return "Attention";
  return "Normal";
}

const patients: Patient[] = [];
const scans: Scan[] = [];

(() => {
  let pid = 1;
  let sid = 1;
  for (let i = 0; i < 64; i++) {
    const gender: Gender = Math.random() > 0.5 ? "Male" : "Female";
    const age = Math.floor(rand(18, 72, 0));
    const height = gender === "Male" ? Math.round(rand(160, 188, 0)) : Math.round(rand(148, 175, 0));
    const branch = branches[i % branches.length];
    const id = `PAT-${String(pid).padStart(5, "0")}`;
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const phone = `+91 ${Math.floor(rand(70, 99, 0))}${Math.floor(rand(10000000, 99999999, 0))}`;
    const registeredDays = Math.floor(rand(30, 720, 0));
    const registered = new Date(Date.now() - registeredDays * 86400000).toISOString();

    // 1-4 scans per patient
    const numScans = Math.floor(rand(1, 4.99, 0));
    let lastScanId = "";
    for (let s = 0; s < numScans; s++) {
      const m = genMeasurement(gender, age, height);
      const branchDevices = devices.filter((d) => d.branchId === branch.id);
      const dev = branchDevices[s % branchDevices.length];
      const daysAgo = (numScans - s - 1) * Math.floor(rand(20, 60, 0)) + Math.floor(rand(0, 5, 0));
      const ts = new Date(Date.now() - daysAgo * 86400000 - Math.floor(rand(0, 86400000, 0))).toISOString();
      const scanId = `SCN-${String(sid).padStart(6, "0")}`;
      scans.push({ id: scanId, patientId: id, branchId: branch.id, deviceId: dev.id, timestamp: ts, status: genStatus(m), measurement: m });
      if (s === numScans - 1) lastScanId = scanId;
      sid++;
    }
    patients.push({
      id, name, gender, age, height, phone,
      email: `${name.toLowerCase().replace(" ", ".")}@mail.com`,
      primaryBranchId: branch.id,
      registeredOn: registered,
      lastScanId,
    });
    pid++;
  }
})();

export { patients, scans };

// Helpers
export const getBranch = (id: string) => branches.find((b) => b.id === id)!;
export const getDevice = (id: string) => devices.find((d) => d.id === id)!;
export const getPatient = (id: string) => patients.find((p) => p.id === id)!;
export const getScan = (id: string) => scans.find((s) => s.id === id)!;
export const getPatientScans = (id: string) => scans.filter((s) => s.patientId === id).sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
export const getBranchScans = (id: string) => scans.filter((s) => s.branchId === id);
export const getDeviceScans = (id: string) => scans.filter((s) => s.deviceId === id);

export const totalsAcrossBranches = {
  branches: branches.length,
  devices: devices.length,
  patients: patients.length,
  scansToday: branches.reduce((a, b) => a + b.todayScans, 0),
  scansWeek: branches.reduce((a, b) => a + b.weeklyScans, 0),
  activeDevices: devices.filter((d) => d.status === "Online").length,
  inactiveDevices: devices.filter((d) => d.status !== "Online").length,
};

// Range standards (used for comparisons)
export const standards = {
  bmi: { min: 18.5, max: 24.9, unit: "kg/m²" },
  fatRatio: { min: 10, max: 20, unit: "%" },
  visceralFat: { min: 1, max: 9, unit: "level" },
  waterRatio: { min: 50, max: 65, unit: "%" },
  proteinRatio: { min: 16, max: 20, unit: "%" },
  skeletalMuscleRatio: { min: 33, max: 39, unit: "%" },
};

export function rangeStatusFor(value: number, min: number, max: number): RangeStatus {
  if (value < min * 0.85) return "High Risk";
  if (value < min) return "Insufficient";
  if (value <= max) return "Standard";
  if (value <= max * 1.15) return "High";
  return "High Risk";
}
