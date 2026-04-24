import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { BackendPatientRecord, ApiResponse } from "./usePatients";
import { ScanStatus, Gender } from "@/data/mockData";

const mapStatus = (status: string | null): ScanStatus => {
  if (status === "completed") return "Normal";
  if (status === "processing") return "Attention";
  return "Critical";
};

const mapGender = (gender: string | null): Gender => {
  if (gender === "female") return "Female";
  return "Male";
};

export const usePatientDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["patient-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");
      
      const response = await apiFetch<ApiResponse<BackendPatientRecord>>(`/api/patient-impedance/${id}`);
      const record = response.data;
      
      const height = record.height || 170;
      const rawWeight = parseFloat(record.weight_kg || "0");
      const rawBmi = height > 0 ? Number((rawWeight / Math.pow(height / 100, 2)).toFixed(1)) : 0;

      const lefuData = record.ai_response_data?.data?.lefuBodyData || [];
      const lefuMap = Object.fromEntries(lefuData.map((p: any) => [p.bodyParamKey, p]));
      
      const getV = (key: string) => lefuMap[key]?.currentValue ?? 0;
      const getS = (key: string) => lefuMap[key]?.standardTitle ?? "N/A";

      // Transform single record to match the structure PatientDetail expects
      return {
        p: {
          id: record.patient_full_body_impedance_id,
          uhid: record.patient_uhid || "N/A",
          dob: record.dob || "N/A",
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
        scans: [{
          id: record.patient_full_body_impedance_id,
          patientId: record.patient_full_body_impedance_id,
          branchId: "BR-001",
          deviceId: "DEV-DYNAMIC",
          timestamp: record.created_at,
          status: mapStatus(record.processing_status),
          measurement: {
            weight: getV("ppWeightKg") || rawWeight,
            bmi: getV("ppBMI") || rawBmi,
            healthScore: getV("ppBodyScore") || 0,
            heartRate: record.heart_rate || 0,
            visceralFat: getV("ppVisceralFat") || 0,
            bodyType: lefuMap["ppBodyType"]?.currentValue || "N/A",
            standardWeight: getV("ppBodyStandardWeightKg"),
            bodyAge: getV("ppBodyAge") || record.age || 0,
            skeletalMuscleMass: getV("ppBodySkeletalKg"),
            skeletalMuscleRatio: getV("ppBodySkeletal"),
            smqi: getV("ppSmi"),
            muscleMass: getV("ppMuscleKg"),
            muscleRate: getV("ppMusclePercentage"),
            trunkMuscleMass: getV("ppMuscleKgTrunk"),
            trunkMuscleRate: getV("ppMuscleRateTrunk"),
            leftArmMuscleMass: getV("ppMuscleKgLeftArm"),
            rightArmMuscleMass: getV("ppMuscleKgRightArm"),
            leftLegMuscleMass: getV("ppMuscleKgLeftLeg"),
            rightLegMuscleMass: getV("ppMuscleKgRightLeg"),
            leftArmMuscleRate: getV("ppMuscleRateLeftArm"),
            rightArmMuscleRate: getV("ppMuscleRateRightArm"),
            leftLegMuscleRate: getV("ppMuscleRateLeftLeg"),
            rightLegMuscleRate: getV("ppMuscleRateRightLeg"),
            muscleControl: getV("ppBodyMuscleControl"),
            fatMass: getV("ppBodyfatKg"),
            fatRatio: getV("ppFat"),
            subcutaneousFatMass: getV("ppBodyFatSubCutKg"),
            subcutaneousFatRatio: getV("ppBodyFatSubCutPercentage"),
            trunkFatMass: getV("ppBodyFatKgTrunk"),
            trunkFatPercentage: getV("ppBodyFatRateTrunk"),
            leftArmFatMass: getV("ppBodyFatKgLeftArm"),
            rightArmFatMass: getV("ppBodyFatKgRightArm"),
            leftLegFatMass: getV("ppBodyFatKgLeftLeg"),
            rightLegFatMass: getV("ppBodyFatKgRightLeg"),
            leftArmFatRatio: getV("ppBodyFatRateLeftArm"),
            rightArmFatRatio: getV("ppBodyFatRateRightArm"),
            leftLegFatRatio: getV("ppBodyFatRateLeftLeg"),
            rightLegFatRatio: getV("ppBodyFatRateRightLeg"),
            fatControl: getV("ppFatControlKg"),
            obesityLevel: getS("ppObesity"),
            obesityLevelNum: getV("ppObesity"),
            obesityDegree: getV("ppFatGrade"),
            totalBodyWater: getV("ppWaterKg"),
            waterRatio: getV("ppWaterPercentage"),
            intracellularWater: getV("ppWaterICWKg"),
            extracellularWater: getV("ppWaterECWKg"),
            proteinMass: getV("ppProteinKg"),
            proteinRatio: getV("ppProteinPercentage"),
            minerals: getV("ppMineralKg"),
            boneMass: getV("ppBoneKg"),
            bodyCellMass: getV("ppCellMassKg"),
            fatFreeMass: getV("ppLoseFatWeightKg"),
            bmr: getV("ppBMR"),
            recommendedCalories: getV("ppDCI"),
            healthEvaluation: getS("ppBodyHealth"),
            weightControl: getV("ppControlWeightKg"),
            waistHipRatio: getV("ppWHR"),
            dynamicStandards: lefuMap,
            impedance: {
              f20: { 
                leftArm: getV("ppZ20KhzLeftArmDeCode"), 
                rightArm: getV("ppZ20KhzRightArmDeCode"), 
                leftLeg: getV("ppZ20KhzLeftLegDeCode"), 
                rightLeg: getV("ppZ20KhzRightLegDeCode"), 
                trunk: getV("ppZ20KhzTrunkDeCode") 
              },
              f100: { 
                leftArm: getV("ppZ100KhzLeftArmDeCode"), 
                rightArm: getV("ppZ100KhzRightArmDeCode"), 
                leftLeg: getV("ppZ100KhzLeftLegDeCode"), 
                rightLeg: getV("ppZ100KhzRightLegDeCode"), 
                trunk: getV("ppZ100KhzTrunkDeCode") 
              },
            }
          }
        }],
        branch: { id: "BR-001", name: "Backend Branch" },
        device: { id: "DEV-DYNAMIC", model: "Dynamic Device" },
      };
    },
    enabled: !!id && id.length > 10, // Only fetch if ID looks like a UUID
  });
};
