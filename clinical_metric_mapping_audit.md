# Clinical Metric Mapping Audit

This document provides a comprehensive cross-reference between the **Backend JSON Schema** (from `askash_json.txt`) and the **Patient Diagnostic Report (PDF)** (implemented in `PatientReportPDF.tsx`).

## 1. General Patient Information
| Metric | Backend Key | PDF Mapping | Status |
| :--- | :--- | :--- | :--- |
| Name | `username` | Header / Patient Card | ✅ Mapped |
| Gender | `gender` | Patient Card (Icon) | ✅ Mapped |
| Age | `age` | Patient Card | ✅ Mapped |
| Height | `height` | Patient Card | ✅ Mapped |
| Scan Timestamp | `created_at` | Patient Card | ✅ Mapped |
| UHID | `patient_uhid` | Patient Card (Implicit) | ✅ Mapped |

## 2. Core Body Composition (Page 1 - Top Left)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| Total Body Water | `ppWaterKg` | Human body composition | ✅ Mapped |
| Water Ratio | `ppWaterPercentage` | Human body composition | ✅ Mapped |
| Fat Mass | `ppBodyfatKg` | Human body composition | ✅ Mapped |
| Protein Mass | `ppProteinKg` | Human body composition | ✅ Mapped |
| Minerals | `ppMineralKg` | Human body composition | ✅ Mapped |
| Weight | `ppWeightKg` | Circular Gauge | ✅ Mapped |

## 3. Physical Condition Gauges (Page 1 - Middle Left)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| BMI | `ppBMI` | Comprehensive physical condition | ✅ Mapped |
| Heart Rate | `heart_rate` | Comprehensive physical condition | ✅ Mapped |
| BMR | `ppBMR` | Comprehensive physical condition | ✅ Mapped |
| Obesity Level | `ppObesity` | Comprehensive physical condition | ✅ Mapped |
| Protein Ratio | `ppProteinPercentage`| Comprehensive physical condition | ✅ Mapped |
| Waist-Hip Ratio | `ppWHR` | Comprehensive physical condition | ✅ Mapped |
| SMI / SMQI | `ppSmi` | Comprehensive physical condition | ✅ Mapped |

## 4. Muscle & Bone Condition (Page 1 - Bottom Left)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| Muscle Mass | `ppMuscleKg` | Muscle and bone condition | ✅ Mapped |
| Skeletal Muscle Mass | `ppBodySkeletalKg`| Muscle and bone condition | ✅ Mapped |
| Skeletal Muscle Ratio| `ppBodySkeletal` | Muscle and bone condition | ✅ Mapped |
| Bone Mass | `ppBoneKg` | Muscle and bone condition | ✅ Mapped |
| Muscle Rate | `ppMusclePercentage`| Muscle and bone condition | ✅ Mapped |

## 5. Fat Analysis (Page 1 - Bottom Left)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| Fat Ratio | `ppFat` | Fat analysis | ✅ Mapped |
| Subcutaneous Fat Mass| `ppBodyFatSubCutKg` | Fat analysis | ✅ Mapped |
| Subcutaneous Fat Ratio| `ppBodyFatSubCutPercentage` | Fat analysis | ✅ Mapped |
| Visceral Fat | `ppVisceralFat` | Fat analysis | ✅ Mapped |
| Fat-free Mass | `ppLoseFatWeightKg`| Fat analysis | ✅ Mapped |

## 6. Body Cell Condition (Page 1 - Bottom Left)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| Extracellular Water | `ppWaterECWKg` | Body cell condition | ✅ Mapped |
| Intracellular Water | `ppWaterICWKg` | Body cell condition | ✅ Mapped |
| Body Cell Mass | `ppCellMassKg` | Body cell condition | ✅ Mapped |

## 7. Health Advice (Page 1 - Top Right)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| Standard Weight | `ppBodyStandardWeightKg` | Health advice | ✅ Mapped |
| Weight Control | `ppControlWeightKg` | Health advice | ✅ Mapped |
| Fat Control | `ppFatControlKg` | Health advice | ✅ Mapped |
| Muscle Control | `ppBodyMuscleControl` | Health advice | ✅ Mapped |
| Health Evaluation | `ppBodyHealth` | Health advice / Card | ✅ Mapped |
| Body Age | `ppBodyAge` | Health advice | ✅ Mapped |
| Recommended Calories | `ppDCI` | Health advice | ✅ Mapped |
| Obesity Degree | `ppFatGrade` | Health advice | ✅ Mapped |

## 8. Segmental Analysis (Page 1 - Right Middle)
| Metric | Lefu Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| Left Arm Muscle Mass | `ppMuscleKgLeftArm` | Segmental muscle analysis | ✅ Mapped |
| Right Arm Muscle Mass| `ppMuscleKgRightArm` | Segmental muscle analysis | ✅ Mapped |
| Trunk Muscle Mass | `ppMuscleKgTrunk` | Segmental muscle analysis | ✅ Mapped |
| Left Leg Muscle Mass | `ppMuscleKgLeftLeg` | Segmental muscle analysis | ✅ Mapped |
| Right Leg Muscle Mass | `ppMuscleKgRightLeg` | Segmental muscle analysis | ✅ Mapped |
| Left Arm Muscle Rate | `ppMuscleRateLeftArm`| Segmental muscle analysis | ✅ Mapped |
| Right Arm Muscle Rate| `ppMuscleRateRightArm`| Segmental muscle analysis | ✅ Mapped |
| Trunk Muscle Rate | `ppMuscleRateTrunk` | Segmental muscle analysis | ✅ Mapped |
| Left Leg Muscle Rate | `ppMuscleRateLeftLeg` | Segmental muscle analysis | ✅ Mapped |
| Right Leg Muscle Rate| `ppMuscleRateRightLeg`| Segmental muscle analysis | ✅ Mapped |
| Left Arm Fat Mass | `ppBodyFatKgLeftArm` | Segmental fat analysis | ✅ Mapped |
| Right Arm Fat Mass | `ppBodyFatKgRightArm`| Segmental fat analysis | ✅ Mapped |
| Trunk Fat Mass | `ppBodyFatKgTrunk` | Segmental fat analysis | ✅ Mapped |
| Left Leg Fat Mass | `ppBodyFatKgLeftLeg` | Segmental fat analysis | ✅ Mapped |
| Right Leg Fat Mass | `ppBodyFatKgRightLeg`| Segmental fat analysis | ✅ Mapped |
| Left Arm Fat Ratio | `ppBodyFatRateLeftArm`| Segmental fat analysis | ✅ Mapped |
| Right Arm Fat Ratio | `ppBodyFatRateRightArm`| Segmental fat analysis | ✅ Mapped |
| Trunk Fat Ratio | `ppBodyFatRateTrunk` | Segmental fat analysis | ✅ Mapped |
| Left Leg Fat Ratio | `ppBodyFatRateLeftLeg`| Segmental fat analysis | ✅ Mapped |
| Right Leg Fat Ratio | `ppBodyFatRateRightLeg`| Segmental fat analysis | ✅ Mapped |

## 9. Technical Metrics (Impedance)
| Metric | Backend Key | PDF Section | Status |
| :--- | :--- | :--- | :--- |
| 20KHz Impedance (L/R/T)| `z20khz_...` | Segmental Impedance (Table) | ✅ Mapped |
| 100KHz Impedance (L/R/T)| `z100khz_...` | Segmental Impedance (Table) | ✅ Mapped |

---
**Summary of Audit:**
All physiological and technical metrics from the backend AI response are now fully mapped and rendered in the professional PDF report. The system achieves **100% data parity** with the medical diagnostic engine.
