import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { ScanStatus, Gender } from "@/data/mockData";

export interface BackendPatientRecord {
  patient_full_body_impedance_id: string;
  patient_uhid: string | null;
  phone_number: string | null;
  gender: "male" | "female" | null;
  age: number | null;
  height: number | null;
  weight_kg: string | null;
  processing_status: "pending" | "processing" | "completed" | null;
  created_at: string;
  ai_response_data: any;
  z20khz_left_arm_encode?: number;
  z20khz_right_arm_encode?: number;
  z20khz_left_leg_encode?: number;
  z20khz_right_leg_encode?: number;
  z20khz_trunk_encode?: number;
  z100khz_left_arm_encode?: number;
  z100khz_right_arm_encode?: number;
  z100khz_left_leg_encode?: number;
  z100khz_right_leg_encode?: number;
  z100khz_trunk_encode?: number;
  heart_rate?: number | null;
  username: string | null;
  dob: string | null;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  count?: number;
  data: T;
  pagination?: {
    limit: number;
    offset: number;
  };
}

const mapStatus = (status: string | null): ScanStatus => {
  if (status === "completed") return "Normal";
  if (status === "processing") return "Attention";
  return "Critical";
};

const mapGender = (gender: string | null): Gender => {
  if (gender === "female") return "Female";
  return "Male";
};

export interface PatientFilters {
  date?: string;
  start_date?: string;
  end_date?: string;
  patient_uhid?: string;
  limit?: number;
  offset?: number;
}

export const usePatients = (filters: PatientFilters = {}) => {
  return useQuery({
    queryKey: ["patients-dynamic", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.patient_uhid) params.append("patient_uhid", filters.patient_uhid);
      if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
      if (filters.offset !== undefined) params.append("offset", filters.offset.toString());

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const response = await apiFetch<ApiResponse<BackendPatientRecord[]>>(`/api/patient-impedance/${queryStr}`);
      
      const mappedData = response.data.map((record) => {
        const height = record.height || 170;
        const rawWeight = parseFloat(record.weight_kg || "0");
        const rawBmi = height > 0 ? Number((rawWeight / Math.pow(height / 100, 2)).toFixed(1)) : 0;

        // The list API might not include full ai_response_data
        const lefuData = record.ai_response_data?.data?.lefuBodyData || [];
        const lefuMap = lefuData.length > 0 
          ? Object.fromEntries(lefuData.map((p: any) => [p.bodyParamKey, p]))
          : {};
        
        const getV = (key: string) => lefuMap[key]?.currentValue;
        const getS = (key: string) => lefuMap[key]?.standardTitle || "N/A";

        return {
          p: {
            id: record.patient_full_body_impedance_id,
            uhid: record.patient_uhid,
            name: record.username || (record.patient_uhid ? `Patient ${record.patient_uhid}` : "Unknown Patient"),
            gender: mapGender(record.gender),
            age: record.age || 0,
            height: height,
            phone: record.phone_number || "N/A",
            email: "dynamic@backend.com",
            primaryBranchId: "BR-001",
            registeredOn: record.created_at,
            lastScanId: record.patient_full_body_impedance_id,
          },
          scan: {
            id: record.patient_full_body_impedance_id,
            patientId: record.patient_full_body_impedance_id,
            branchId: "BR-001",
            deviceId: "DEV-DYNAMIC",
            timestamp: record.created_at,
            status: mapStatus(record.processing_status),
            measurement: {
              weight: getV("ppWeightKg") ?? rawWeight,
              bmi: getV("ppBMI") ?? rawBmi,
              healthScore: getV("ppBodyScore") ?? 0,
              heartRate: record.heart_rate || 0,
              visceralFat: getV("ppVisceralFat") ?? 0,
              bodyType: lefuMap["ppBodyType"]?.currentValue || "N/A",
              standardWeight: getV("ppBodyStandardWeightKg") ?? 0,
              bodyAge: getV("ppBodyAge") ?? record.age ?? 0,
              skeletalMuscleMass: getV("ppBodySkeletalKg") ?? 0,
              skeletalMuscleRatio: getV("ppBodySkeletal") ?? 0,
              smqi: getV("ppSmi") ?? 0,
              muscleMass: getV("ppMuscleKg") ?? 0,
              muscleRate: getV("ppMusclePercentage") ?? 0,
              trunkMuscleMass: getV("ppMuscleKgTrunk") ?? 0,
              trunkMuscleRate: getV("ppMuscleRateTrunk") ?? 0,
              leftArmMuscleMass: getV("ppMuscleKgLeftArm") ?? 0,
              rightArmMuscleMass: getV("ppMuscleKgRightArm") ?? 0,
              leftLegMuscleMass: getV("ppMuscleKgLeftLeg") ?? 0,
              rightLegMuscleMass: getV("ppMuscleKgRightLeg") ?? 0,
              leftArmMuscleRate: getV("ppMuscleRateLeftArm") ?? 0,
              rightArmMuscleRate: getV("ppMuscleRateRightArm") ?? 0,
              leftLegMuscleRate: getV("ppMuscleRateLeftLeg") ?? 0,
              rightLegMuscleRate: getV("ppMuscleRateRightLeg") ?? 0,
              muscleControl: getV("ppBodyMuscleControl") ?? 0,
              fatMass: getV("ppBodyfatKg") ?? 0,
              fatRatio: getV("ppFat") ?? 0,
              subcutaneousFatMass: getV("ppBodyFatSubCutKg") ?? 0,
              subcutaneousFatRatio: getV("ppBodyFatSubCutPercentage") ?? 0,
              trunkFatMass: getV("ppBodyFatKgTrunk") ?? 0,
              trunkFatPercentage: getV("ppBodyFatRateTrunk") ?? 0,
              leftArmFatMass: getV("ppBodyFatKgLeftArm") ?? 0,
              rightArmFatMass: getV("ppBodyFatKgRightArm") ?? 0,
              leftLegFatMass: getV("ppBodyFatKgLeftLeg") ?? 0,
              rightLegFatMass: getV("ppBodyFatKgRightLeg") ?? 0,
              leftArmFatRatio: getV("ppBodyFatRateLeftArm") ?? 0,
              rightArmFatRatio: getV("ppBodyFatRateRightArm") ?? 0,
              leftLegFatRatio: getV("ppBodyFatRateLeftLeg") ?? 0,
              rightLegFatRatio: getV("ppBodyFatRateRightLeg") ?? 0,
              fatControl: getV("ppFatControlKg") ?? 0,
              obesityLevel: getS("ppObesity"),
              obesityLevelNum: getV("ppObesity") ?? 0,
              obesityDegree: getV("ppFatGrade") ?? 0,
              totalBodyWater: getV("ppWaterKg") ?? 0,
              waterRatio: getV("ppWaterPercentage") ?? 0,
              intracellularWater: getV("ppWaterICWKg") ?? 0,
              extracellularWater: getV("ppWaterECWKg") ?? 0,
              proteinMass: getV("ppProteinKg") ?? 0,
              proteinRatio: getV("ppProteinPercentage") ?? 0,
              minerals: getV("ppMineralKg") ?? 0,
              boneMass: getV("ppBoneKg") ?? 0,
              bodyCellMass: getV("ppCellMassKg") ?? 0,
              fatFreeMass: getV("ppLoseFatWeightKg") ?? 0,
              bmr: getV("ppBMR") ?? 0,
              recommendedCalories: getV("ppDCI") ?? 0,
              healthEvaluation: getS("ppBodyHealth"),
              weightControl: getV("ppControlWeightKg") ?? 0,
              waistHipRatio: getV("ppWHR") ?? 0,
              dynamicStandards: lefuMap,
              impedance: {
                f20: { 
                  leftArm: record.z20khz_left_arm_encode || 0, 
                  rightArm: record.z20khz_right_arm_encode || 0, 
                  leftLeg: record.z20khz_left_leg_encode || 0, 
                  rightLeg: record.z20khz_right_leg_encode || 0, 
                  trunk: record.z20khz_trunk_encode || 0 
                },
                f100: { 
                  leftArm: record.z100khz_left_arm_encode || 0, 
                  rightArm: record.z100khz_right_arm_encode || 0, 
                  leftLeg: record.z100khz_left_leg_encode || 0, 
                  rightLeg: record.z100khz_right_leg_encode || 0, 
                  trunk: record.z100khz_trunk_encode || 0 
                },
              }
            },
          },
          branch: { id: "BR-001", name: "Backend Branch" },
          device: { id: "DEV-DYNAMIC", model: "Dynamic Device" },
        };
      });
      return {
        data: mappedData,
        count: response.count ?? mappedData.length,
        pagination: response.pagination
      };
    },
  });
};
