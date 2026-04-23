# Data Mapping Documentation: Backend AI JSON to Frontend UI

This document details how the complex physiological data from the AI-powered backend is transformed and rendered in the Mayurah Health Insights frontend.

## 1. Data Source Structure
The primary source of dynamic data is the `ai_response_data` field returned by the Django API. Within this object, the most critical section is:
`ai_response_data.data.lefuBodyData`

This is an array of biometric parameter objects. Each object follows this schema:
```json
{
  "bodyParamKey": "ppBMI",
  "currentValue": 21.3,
  "standardTitle": "Normal",
  "standardArray": [18.5, 24.9, 0],
  "standColor": "#00FF00",
  "standeEvaluation": "Your BMI is within the healthy range...",
  "standSuggestion": "Maintain your current active lifestyle..."
}
```

## 2. Transformation Logic (Hooks)
In both `usePatients.ts` and `usePatientDetail.ts`, we perform a transformation to make this data easily accessible to UI components.

### Map Creation
We convert the array into a keyed object (Map) for O(1) lookups by `bodyParamKey`:
```typescript
const lefuData = record.ai_response_data?.data?.lefuBodyData || [];
const lefuMap = Object.fromEntries(lefuData.map((p) => [p.bodyParamKey, p]));
```

### Accessor Helpers
We use helpers to safely extract values with defaults:
- `getV(key)`: Returns the `currentValue`.
- `getS(key)`: Returns the `standardTitle` (e.g., "Excellent", "Normal").
- `lefuMap[key]`: Returns the full metadata object including colors and suggestions.

---

## 3. UI Component Mapping

### A. Core Metrics (MetricSquare)
Mapped in the **Overview** and **Composition** tabs.
- **Value:** `item.value` (from `getV(key)`)
- **Status Badge:** Pulls `standardTitle` and applies `standColor` for high-end clinical visual feedback.
- **Status Text:** Displayed as an uppercase badge (e.g., "INSUFFICIENT" in yellow).

### B. High-Fidelity Gauges (GaugeCard)
Used for the primary 4 metrics (Weight, BMI, Muscle, Fat).
- **Current Value:** `m.bmi`
- **Standard Range:** The markers on the gauge represent `standardArray[0]` (Min) and `standardArray[1]` (Max).
- **Dynamic Color:** If the backend returns a specific `standColor` (e.g., Red for Critical), the gauge pointer and arc dynamically override their default theme colors.

### C. Anatomical Diagrams (BodySegmentDiagram)
Used for Muscle and Fat segmental distribution.
- **Left Arm:** `ppMuscleKgLeftArm` (Current) + `ppMuscleRateLeftArm` (Ratio)
- **Right Arm:** `ppMuscleKgRightArm` + `ppMuscleRateRightArm`
- **Trunk:** `ppMuscleKgTrunk` + `ppMuscleRateTrunk`
- **Legs:** `ppMuscleKgLeft/RightLeg` + `ppMuscleRateLeft/RightLeg`
- **Segment Colors:** Each segment label text is colored using the backend's `standColor` for that specific anatomical part.

### D. Clinical Insights Section
- **Evaluation Text:** Mapped to `m.dynamicStandards["ppBodyHealth"].standeEvaluation`.
- **Suggestion Text:** Mapped to `m.dynamicStandards["ppBodyHealth"].standSuggestion`.

---

## 4. Complete Parameter Key Reference (50+ Metrics)

| Category | UI / Measurement Field | Backend `bodyParamKey` | Description |
| :--- | :--- | :--- | :--- |
| **Basic** | Weight | `ppWeightKg` | Total body weight in kg |
| **Basic** | BMI | `ppBMI` | Body Mass Index |
| **Basic** | Health Score | `ppBodyScore` | Overall metabolic health score (0-100) |
| **Basic** | Visceral Fat | `ppVisceralFat` | Visceral fat level (1-30) |
| **Basic** | Body Type | `ppBodyType` | Categorical body shape (e.g., Hidden Obese) |
| **Basic** | Standard Weight | `ppBodyStandardWeightKg` | Ideal weight for height |
| **Basic** | Body Age | `ppBodyAge` | Metabolic age based on composition |
| **Basic** | Weight Control | `ppControlWeightKg` | Recommended weight change needed |
| **Basic** | Waist-Hip Ratio | `ppWHR` | Calculated waist-to-hip ratio |
| **Muscle** | Skeletal Muscle Mass | `ppBodySkeletalKg` | Mass of skeletal muscles |
| **Muscle** | Skeletal Muscle Ratio | `ppBodySkeletal` | Percentage of skeletal muscle |
| **Muscle** | SMQI / SMI | `ppSmi` | Skeletal Muscle Mass Index |
| **Muscle** | Muscle Mass (Total) | `ppMuscleKg` | Total mass of all muscles |
| **Muscle** | Muscle Rate | `ppMusclePercentage` | Percentage of total muscle |
| **Muscle** | Trunk Muscle Mass | `ppMuscleKgTrunk` | Muscle mass in the torso |
| **Muscle** | Trunk Muscle Rate | `ppMuscleRateTrunk` | Muscle percentage in the torso |
| **Muscle** | Left Arm Muscle Mass | `ppMuscleKgLeftArm` | Muscle mass in left arm |
| **Muscle** | Right Arm Muscle Mass | `ppMuscleKgRightArm` | Muscle mass in right arm |
| **Muscle** | Left Leg Muscle Mass | `ppMuscleKgLeftLeg` | Muscle mass in left leg |
| **Muscle** | Right Leg Muscle Mass | `ppMuscleKgRightLeg` | Muscle mass in right leg |
| **Muscle** | Left Arm Muscle Rate | `ppMuscleRateLeftArm` | Muscle percentage in left arm |
| **Muscle** | Right Arm Muscle Rate | `ppMuscleRateRightArm` | Muscle percentage in right arm |
| **Muscle** | Left Leg Muscle Rate | `ppMuscleRateLeftLeg` | Muscle percentage in left leg |
| **Muscle** | Right Leg Muscle Rate | `ppMuscleRateRightLeg` | Muscle percentage in right leg |
| **Muscle** | Muscle Control | `ppBodyMuscleControl` | Recommended muscle gain/loss |
| **Fat** | Fat Mass | `ppBodyfatKg` | Total body fat in kg |
| **Fat** | Fat Ratio | `ppFat` | Total body fat percentage |
| **Fat** | Subcutaneous Fat Mass | `ppBodyFatSubCutKg` | Subcutaneous fat in kg |
| **Fat** | Subcutaneous Fat Ratio | `ppBodyFatSubCutPercentage` | Subcutaneous fat percentage |
| **Fat** | Trunk Fat Mass | `ppBodyFatKgTrunk` | Fat mass in the torso |
| **Fat** | Trunk Fat Percentage | `ppBodyFatRateTrunk` | Fat percentage in the torso |
| **Fat** | Left Arm Fat Mass | `ppBodyFatKgLeftArm` | Fat mass in left arm |
| **Fat** | Right Arm Fat Mass | `ppBodyFatKgRightArm` | Fat mass in right arm |
| **Fat** | Left Leg Fat Mass | `ppBodyFatKgLeftLeg` | Fat mass in left leg |
| **Fat** | Right Leg Fat Mass | `ppBodyFatKgRightLeg` | Fat mass in right leg |
| **Fat** | Left Arm Fat Ratio | `ppBodyFatRateLeftArm` | Fat percentage in left arm |
| **Fat** | Right Arm Fat Ratio | `ppBodyFatRateRightArm` | Fat percentage in right arm |
| **Fat** | Left Leg Fat Ratio | `ppBodyFatRateLeftLeg` | Fat percentage in left leg |
| **Fat** | Right Leg Fat Ratio | `ppBodyFatRateRightLeg` | Fat percentage in right leg |
| **Fat** | Fat Control | `ppFatControlKg` | Recommended fat loss/gain |
| **Fat** | Obesity Degree | `ppFatGrade` | Degree of obesity percentage |
| **Water** | Body Water (Total) | `ppWaterKg` | Total body water in kg |
| **Water** | Water Ratio | `ppWaterPercentage` | Total water percentage |
| **Water** | Intracellular Water | `ppWaterICWKg` | Water inside cells (kg) |
| **Water** | Extracellular Water | `ppWaterECWKg` | Water outside cells (kg) |
| **Protein** | Protein Mass | `ppProteinKg` | Total protein in kg |
| **Protein** | Protein Ratio | `ppProteinPercentage` | Protein percentage |
| **Minerals** | Minerals | `ppMineralKg` | Total mineral content |
| **Minerals** | Bone Mass | `ppBoneKg` | Bone mineral content |
| **Minerals** | Body Cell Mass | `ppCellMassKg` | Total mass of living cells |
| **Minerals** | FFM | `ppLoseFatWeightKg` | Fat-Free Mass |
| **Metabolic** | BMR | `ppBMR` | Basal Metabolic Rate (kcal) |
| **Metabolic** | Recommended Cal. | `ppDCI` | Daily Caloric Intake recommendation |
| **Metabolic** | Health Evaluation | `ppBodyHealth` | Clinical summary of health |

## 5. Toggle Persistence
The state of the **"Live Backend Data"** switch is persisted using `localStorage` with the key `mayurah-dynamic-mode`. This ensures that once a clinician enables live data, it remains active throughout their session.
