import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import muscleAnatomy from "@/assets/3d_muscular_anatomy_human_1776422761523.png";
import fatAnatomy from "@/assets/3d_human_anatomy_with_fat_layer_1776423834660.png";
import scaleImage from "@/assets/clinical_body_composition_scale.png";
import mayuraLogo from "@/assets/mayura_logo.png";

interface PatientReportPDFProps {
  patient: any;
  latestScan: any;
  scans: any[];
  branch: any;
  device: any;
}

export const PatientReportPDF = React.forwardRef<HTMLDivElement, PatientReportPDFProps>(
  ({ patient, latestScan, scans }, ref) => {
    if (!latestScan) return null;
    const m = latestScan.measurement;

    const SectionHeader = ({ title }: { title: string }) => (
      <div className="bg-[#b3b8bd] text-white rounded-md shadow-inner h-[18px] flex flex-col justify-center items-center mb-1 mt-1 first:mt-0 overflow-hidden">
        <span className="text-[8px] font-bold uppercase tracking-widest leading-none block -translate-y-[1px]">
          {title}
        </span>
      </div>
    );

    const NoDataPlaceholder = ({ message = "Pending full body analysis" }: { message?: string }) => (
      <div className="flex-1 h-full w-full flex flex-col items-center justify-center bg-gray-50/30 rounded-xl border border-dashed border-gray-100 p-4">
        <div className="w-6 h-6 rounded-full border border-gray-100 flex items-center justify-center mb-1.5 opacity-50">
          <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <span className="text-[6px] font-black text-gray-300 uppercase tracking-[0.2em] text-center max-w-[80px] leading-tight">
          {message}
        </span>
      </div>
    );

    const isDataMissing = (values: (number | string | undefined | null)[]) => {
      return values.every(v => !v || v === 0 || v === "0" || v === "0.0");
    };

    const GaugeRow = ({ label, value, labels = [], colors = ["bg-yellow-400", "bg-green-400", "bg-red-400"], isLast = false }: any) => {
      const valNum = typeof value === "string" ? parseFloat(value) : value;
      let pos = 50;
      if (labels.length >= 2) {
        const lo = labels[0] as number;
        const hi = labels[labels.length - 1] as number;
        const range = hi - lo;
        pos = ((valNum - lo) / range) * 100;
      }
      const safePos = Math.min(96, Math.max(4, pos));

      return (
        <div className={cn("flex items-center justify-between text-[8px] border-b border-gray-50 pb-1", isLast && "border-0 pb-0")}>
          <span className="text-gray-500 w-[80px] leading-tight" dangerouslySetInnerHTML={{ __html: label }} />
          <div className="flex-1 px-2 relative -top-1">
            <div className="flex justify-between text-[6px] font-bold text-gray-400 mb-0.5">
              <span className="ml-4">{labels[0]}</span>
              <span className="mr-4">{labels[labels.length - 1]}</span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full flex overflow-hidden relative">
              {colors.map((c: string, i: number) => (
                <div key={i} className={cn(c, "h-full")} style={{ width: `${100 / colors.length}%` }} />
              ))}
              <div
                className="absolute top-1/2 w-0.5 h-3 bg-slate-900 z-20 -translate-y-1/2"
                style={{ left: `${safePos}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>
          <span className="font-bold text-[9px] w-[20px] text-right">{value}</span>
        </div>
      );
    };

    const SparklineHistory = ({ dataKey, label, color = "blue", max = 100 }: { dataKey: string, label: string, color?: "blue" | "green" | "yellow", max?: number }) => {
      const historyItems = scans.slice(0, 8).reverse();
      const colorMap = {
        blue: { text: "text-blue-600", dot: "bg-blue-500", line: "bg-blue-100" },
        green: { text: "text-green-600", dot: "bg-green-500", line: "bg-green-100" },
        yellow: { text: "text-yellow-600", dot: "bg-yellow-500", line: "bg-yellow-100" }
      };
      const colors = colorMap[color] || colorMap.blue;

      return (
        <div className="flex items-center w-full py-1.5 border-b border-gray-50 last:border-0">
          <div className="w-16 shrink-0">
            <div className="text-[6px] font-black text-slate-500 uppercase tracking-tighter leading-none">{label}</div>
          </div>
          <div className="flex-1 flex justify-between items-center px-2 relative h-6">
            {/* Connecting line */}
            <div className={cn("absolute left-4 right-4 h-[0.5px] top-1/2 -translate-y-1/2 opacity-30", colors.line)} />

            {historyItems.map((s, i) => {
              const val = (s.measurement as any)[dataKey] || 0;
              const heightOffset = ((val / max) * 10) - 5; // Slight vertical oscillation for visual effect

              return (
                <div key={i} className="flex flex-col items-center relative z-10">
                  <div className={cn("text-[5.5px] font-bold mb-0.5", colors.text)}>{val}</div>
                  <div className={cn("w-1.5 h-1.5 rounded-full border-[0.5px] border-white shadow-sm", colors.dot)}
                    style={{ transform: `translateY(${heightOffset}px)` }} />
                  {/* Date label removed in favor of central header */}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        id="report-pdf-content"
        className="bg-[#f0f2f5] mx-auto font-sans text-slate-800 pt-[20px] px-[30px] pb-[50px] overflow-hidden flex flex-col w-[800px] h-[1120px] relative"
        style={{ boxSizing: "border-box" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-1 px-1">
          <div className="flex items-center gap-2">
            <img src={mayuraLogo} alt="Mayura Hospitals" className="h-12 w-auto object-contain" />
          </div>
          <div className="text-[9px] font-bold tracking-wide text-slate-500 uppercase">Human body composition analysis report</div>
        </div>

        {/* Patient Card */}
        <div className="bg-white rounded flex items-center justify-between p-2 mb-1 shadow-sm border border-gray-100 h-[46px]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
              <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbTl8kJmS_rokgGTCvDD8kB6ghSHvBGTNjP6nBgPZk8tDHYTTPjGGaD-4xHoxr2-9-ZFv-8HBmocOxk9iAWuHIdqheyN_wnate9VbFAvyGKMgl0Nd0uJkywSvJZL8FdKHVcwkZWZ6WghkfbFaQcQ4iKOVkd027mZnhx2hwovGc1pqA-secbtppeZMLZHrYxFbSkVujsLrzEmsyPzKnMmaiXPF16VEw436hUU72TFKlkJDwldY7N1sMKGQeQBZDUqK4SClBLjBJ1po" />
            </div>
            <div>
              <div className="font-bold text-[13px] leading-tight flex items-center gap-1">
                {patient.name} <span className="text-blue-500 text-[10px]">♂</span>
              </div>
              <div className="text-[8px] text-gray-500 font-medium">{format(new Date(latestScan.timestamp), "dd-MM-yyyy HH:mm")}</div>
            </div>
          </div>
          <div className="border-l border-gray-100 pl-2">
            <div className="text-[8px] font-bold text-center text-gray-400 uppercase">Age</div>
            <div className="text-[11px] font-bold">{patient.age}Age</div>
          </div>
          <div className="border-l border-gray-100 pl-2">
            <div className="text-[8px] font-bold text-center text-gray-400 uppercase">Height</div>
            <div className="text-[11px] font-bold">{patient.height}cm</div>
          </div>
          <div className="border-l border-gray-100 pl-2 text-right">
            <div className="text-[8px] font-bold uppercase text-gray-400 text-center">Health Score</div>
            <div className="text-base font-black text-blue-600 tracking-tighter leading-none pb-1">
              {m.healthScore} <span className="text-[8px] font-bold text-blue-400/80 uppercase">
                {m.dynamicStandards?.ppBodyScore?.standardTitle || m.healthEvaluation || "SUB-HEALTH"}
              </span>
            </div>
            {/* <div className="text-[7px] text-gray-400 font-bold uppercase mt-0.5">Standard(60~100)</div> */}
          </div>
        </div>

        <div className="flex gap-1 items-start">
          {/* Left Column (45%) */}
          <div className="w-[45%] flex flex-col gap-1">
            <SectionHeader title="Human body composition" />
            <div className="flex items-start gap-2">
              <div className="flex-1 flex flex-col gap-1">
                {[
                  { l: "Total Body Water(kg)", v: m.totalBodyWater, c: "bg-cyan-400", r: `Standard(${m.dynamicStandards?.ppWaterKg?.standardArray?.[0] || "34.5"}~${m.dynamicStandards?.ppWaterKg?.standardArray?.[1] || "42.1"})` },
                  { l: "Water Ratio(%)", v: m.waterRatio, c: "bg-cyan-400", r: `Standard(${m.dynamicStandards?.ppWaterPercentage?.standardArray?.[0] || "49.3"}~${m.dynamicStandards?.ppWaterPercentage?.standardArray?.[1] || "60.2"})` },
                  { l: "Fat Mass(kg)", v: m.fatMass, c: "bg-yellow-400", r: `Overweight(${m.dynamicStandards?.ppBodyfatKg?.standardArray?.[0] || "7.4"}~${m.dynamicStandards?.ppBodyfatKg?.standardArray?.[1] || "14.8"})` },
                  { l: "Protein Mass(kg)", v: m.proteinMass, c: "bg-red-400", r: `Standard(${m.dynamicStandards?.ppProteinKg?.standardArray?.[0] || "9.2"}~${m.dynamicStandards?.ppProteinKg?.standardArray?.[1] || "11.2"})` },
                  { l: "Minerals(kg)", v: m.minerals, c: "bg-cyan-400", r: `Standard(${m.dynamicStandards?.ppMineralKg?.standardArray?.[0] || "3.1"}~${m.dynamicStandards?.ppMineralKg?.standardArray?.[1] || "3.8"})` },
                ].map((item) => (
                  <div key={item.l} className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center justify-between text-[6px]">
                    <div className="flex items-center gap-1 w-[45%]">
                      <div className={cn("w-1.5 h-1.5 rounded-full", item.c)} />

                      <span className="text-gray-500 leading-[1.2]">
                        {item.l}
                      </span>
                    </div>

                    <div className="w-[15%] text-center font-bold">
                      {item.v}
                    </div>

                    <div className="w-[40%] text-right text-gray-400 leading-[1.2]">
                      {item.r}
                    </div>
                  </div>
                ))}

                <div className="text-[6px] text-gray-400 font-bold uppercase mt-0.5 leading-tight">
                  Weight:{m.dynamicStandards?.ppWeightKg?.standardTitle || "Standard"};Total Body Water:{m.dynamicStandards?.ppWaterKg?.standardTitle || "Standard"};Fat Mass:{m.dynamicStandards?.ppBodyfatKg?.standardTitle || "Standard"};Protein Mass:{m.dynamicStandards?.ppProteinKg?.standardTitle || "Standard"};Minerals:{m.dynamicStandards?.ppMineralKg?.standardTitle || "Standard"}
                </div>
              </div>

              {/* Weight Circular Gauge */}
              <div className="w-28 h-28 relative flex flex-col items-center justify-center">
                <svg className="w-24 h-24 rotate-[-90deg]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#eee" strokeWidth="10" />
                  {/* Purple segment */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e040fb" strokeWidth="10" strokeDasharray="62.8 188.4" strokeDashoffset="0" />
                  {/* Cyan segment */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#00e5ff" strokeWidth="10" strokeDasharray="15.7 235.5" strokeDashoffset="-62.8" />
                  {/* Orange segment */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ffb74d" strokeWidth="10" strokeDasharray="31.4 219.8" strokeDashoffset="-78.5" />
                  {/* Blue segment */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#448aff" strokeWidth="10" strokeDasharray="141.3 109.9" strokeDashoffset="-109.9" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[7px] text-slate-500 font-bold uppercase">Weight</span>
                  <span className="text-[12px] font-black leading-none">{m.weight}kg</span>
                  <span className="text-[7px] text-gray-400 font-bold mt-0.5">(52~71)</span>
                  <span className="text-[7px] text-gray-400 font-bold uppercase">Overweight</span>
                </div>
              </div>
            </div>

            <SectionHeader title="Comprehensive physical condition" />
            <div className="flex flex-col gap-1">
              {[
                { k: "ppBMI", l: "BMI (Body Mass Index)", v: m.bmi, s: [18.5, 23], c: ["#F5A623", "#14CCAD", "#F43F31"], unit: "" },
                { k: "heartRate", l: "Heart Rate(bpm)", v: m.heartRate || 75, s: [55, 80, 100], c: ["bg-yellow-400", "bg-green-400", "bg-red-400", "bg-red-700"], unit: "" },
                { k: "ppBMR", l: "BMR (Basal Metabolic Rate)(kcal)", v: m.bmr, s: [1581, 1850], c: ["#F5A623", "#14CCAD", "#0F9982"], unit: "" },
                { k: "ppObesity", l: "Obesity Level(%)", v: m.obesityLevelNum || 100, s: [90, 110], c: ["#F5A623", "#14CCAD", "#F43F31"], unit: "" },
                { k: "ppProteinPercentage", l: "Protein Ratio(%)", v: m.proteinRatio, s: [12.5, 15.2], c: ["#F5A623", "#14CCAD", "#0F9982"], unit: "" },
                { k: "ppWHR", l: "Waist-hip Ratio", v: m.waistHipRatio ?? 0.9, s: [0.8, 0.9], c: ["#F5A623", "#14CCAD", "#0F9982"], unit: "" },
                { k: "ppSmi", l: "Skeletal Muscle Quality Index(SMI)", v: m.smqi, s: [7.0], c: ["#F5A623", "#14CCAD"], unit: "" },
              ].map((item) => {
                const std = m.dynamicStandards?.[item.k];
                const val = std?.currentValue ?? item.v;
                const standards = std?.standardArray?.length > 0 ? std.standardArray : item.s;
                // Exclude heart rate from JSON colors as requested
                const colors = (item.k !== "heartRate" && std?.colorArray?.length > 0) ? std.colorArray : item.c;

                const numSegments = colors.length;

                let pos;
                if (standards.length === 1) {
                  const lo = standards[0];
                  const loPos = 100 / numSegments;
                  pos = val < lo ? (val / lo) * loPos : loPos + ((val - lo) / lo) * loPos;
                } else {
                  const lo = standards[0];
                  const hi = standards[standards.length - 1];
                  const loPos = 100 / numSegments;
                  const hiPos = (100 / numSegments) * (numSegments - 1);

                  if (val < lo) {
                    const minVal = lo - (standards[1] - lo);
                    pos = Math.max(0, (val - minVal) / (lo - minVal)) * loPos;
                  } else if (val > hi) {
                    const maxVal = hi + (hi - (standards[standards.length - 2] || (hi - 1)));
                    pos = hiPos + Math.min(1, (val - hi) / (maxVal - hi)) * (100 - hiPos);
                  } else {
                    let segIdx = 0;
                    for (let i = 0; i < standards.length - 1; i++) {
                      if (val <= standards[i + 1]) {
                        segIdx = i;
                        break;
                      }
                    }
                    const sLo = standards[segIdx];
                    const sHi = standards[segIdx + 1];
                    const pLo = ((segIdx + 1) * 100) / numSegments;
                    const pHi = ((segIdx + 2) * 100) / numSegments;
                    pos = pLo + ((val - sLo) / (sHi - sLo)) * (pHi - pLo);
                  }
                }
                const safePos = Math.min(95, Math.max(5, pos));

                return (
                  <div key={item.l} className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="text-[7px] text-gray-500 font-bold w-[75px] leading-tight flex-shrink-0">{item.l}</span>
                    <div className="flex-1 px-4 relative pt-[10px] pb-0.5">
                      <div className="absolute top-[-5px] left-4 right-4 h-0 text-[6px] font-bold text-gray-400">
                        {standards.map((s, idx) => (
                          <span
                            key={idx}
                            className="absolute -translate-x-1/2 whitespace-nowrap"
                            style={{ left: `${((idx + 1) * 100) / numSegments}%` }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full flex overflow-hidden relative">
                        {colors.map((color, i) => (
                          <div
                            key={i}
                            className={cn(!color.startsWith('#') && color, "h-full flex-1")}
                            style={color.startsWith('#') ? { backgroundColor: color } : {}}
                          />
                        ))}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 border border-white shadow-sm z-10"
                          style={{ left: `${safePos}%`, transform: 'translate(-50%, -50%)' }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-slate-800 w-[25px] text-right flex-shrink-0">{val}</span>
                  </div>
                );
              })}
              <div className="text-[6.5px] leading-tight text-gray-500 font-medium pt-0.5 px-1">
                BMI:{m.dynamicStandards?.ppBMI?.standardTitle || "Standard"};
                Heart Rate:Normal;
                BMR:{m.dynamicStandards?.ppBMR?.standardTitle || "Standard"};
                Obesity Level:{m.dynamicStandards?.ppObesity?.standardTitle || "Standard"};
                Protein Ratio:{m.dynamicStandards?.ppProteinPercentage?.standardTitle || "Standard"};
                Waist-hip Ratio:{m.dynamicStandards?.ppWHR?.standardTitle || "Standard"}
              </div>
            </div>

            <SectionHeader title="Muscle and bone condition" />
            <div className="flex flex-col gap-1">              {[
              { k: "ppMuscleKg", l: "Muscle Mass(kg)", v: m.muscleMass, s: [45.1, 58.7], c: ["#F5A623", "#14CCAD", "#0F9982"] },
              { k: "ppBodySkeletalKg", l: "Skeletal Muscle Mass(kg)", v: m.skeletalMuscleMass, s: [24.4, 31.8], c: ["#F5A623", "#14CCAD", "#0F9982"] },
              { k: "ppBodySkeletal", l: "Skeletal Muscle Ratio(%)", v: m.skeletalMuscleRatio, s: [35.6, 43.5], c: ["#F5A623", "#14CCAD", "#0F9982"] },
              { k: "ppBoneKg", l: "Bone Mass(kg)", v: m.boneMass, s: [2.6, 3.3], c: ["#F5A623", "#14CCAD", "#0F9982"] },
              { k: "ppMusclePercentage", l: "Muscle Rate(%)", v: m.muscleRate, s: [75.5, 103.8], c: ["#F5A623", "#14CCAD", "#0F9982"] },
            ].map((item) => {
              const std = m.dynamicStandards?.[item.k];
              const val = std?.currentValue ?? item.v;
              const standards = std?.standardArray?.length > 0 ? std.standardArray : item.s;
              const colors = std?.colorArray?.length > 0 ? std.colorArray : item.c;

              const numSegments = colors.length;

              let pos;
              if (standards.length === 1) {
                const lo = standards[0];
                const loPos = 100 / numSegments;
                pos = val < lo ? (val / lo) * loPos : loPos + ((val - lo) / lo) * loPos;
              } else {
                const lo = standards[0];
                const hi = standards[standards.length - 1];
                const loPos = 100 / numSegments;
                const hiPos = (100 / numSegments) * (numSegments - 1);

                if (val < lo) {
                  const minVal = lo - (standards[1] - lo);
                  pos = Math.max(0, (val - minVal) / (lo - minVal)) * loPos;
                } else if (val > hi) {
                  const maxVal = hi + (hi - (standards[standards.length - 2] || (hi - 1)));
                  pos = hiPos + Math.min(1, (val - hi) / (maxVal - hi)) * (100 - hiPos);
                } else {
                  let segIdx = 0;
                  for (let i = 0; i < standards.length - 1; i++) {
                    if (val <= standards[i + 1]) {
                      segIdx = i;
                      break;
                    }
                  }
                  const sLo = standards[segIdx];
                  const sHi = standards[segIdx + 1];
                  const pLo = ((segIdx + 1) * 100) / numSegments;
                  const pHi = ((segIdx + 2) * 100) / numSegments;
                  pos = pLo + ((val - sLo) / (sHi - sLo)) * (pHi - pLo);
                }
              }
              const safePos = Math.min(95, Math.max(5, pos));

              return (
                <div key={item.l} className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="text-[7px] text-gray-500 font-bold w-[75px] leading-tight flex-shrink-0">{item.l}</span>
                  <div className="flex-1 px-4 relative pt-[10px] pb-0.5">
                    <div className="absolute top-[-5px] left-4 right-4 h-0 text-[6px] font-bold text-gray-400">
                      {standards.map((s, idx) => (
                        <span
                          key={idx}
                          className="absolute -translate-x-1/2 whitespace-nowrap"
                          style={{ left: `${((idx + 1) * 100) / numSegments}%` }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full flex overflow-hidden relative">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className={cn(!color.startsWith('#') && color, "h-full flex-1")}
                          style={color.startsWith('#') ? { backgroundColor: color } : {}}
                        />
                      ))}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 border border-white shadow-sm z-10"
                        style={{ left: `${safePos}%`, transform: 'translate(-50%, -50%)' }}
                      />
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-slate-800 w-[25px] text-right flex-shrink-0">{val}</span>
                </div>
              );
            })}
              <div className="text-[6.5px] leading-tight text-gray-500 font-medium px-1">
                Muscle Mass:{m.dynamicStandards?.ppMuscleKg?.standardTitle || "Standard"};
                Skeletal Muscle Mass:{m.dynamicStandards?.ppBodySkeletalKg?.standardTitle || "Standard"};
                Skeletal Muscle Ratio:{m.dynamicStandards?.ppBodySkeletal?.standardTitle || "Standard"};
                Bone Mass:{m.dynamicStandards?.ppBoneKg?.standardTitle || "Standard"}
              </div>
            </div>

            <SectionHeader title="Fat analysis" />
            <div className="flex flex-col gap-1">
              {[
                { k: "ppFat", l: "Fat Ratio(%)", v: m.fatRatio, s: [10, 20], c: ["#14CCAD", "#F5A623", "#F43F31"] },
                { k: "ppBodyFatSubCutKg", l: "Subcutaneous Fat Mass(kg)", v: m.subcutaneousFatMass, s: [5.2, 10.2], c: ["#14CCAD", "#F5A623", "#F43F31"] },
                { k: "ppBodyFatSubCutPercentage", l: "Subcutaneous Fat Ratio(%)", v: m.subcutaneousFatRatio, s: [8.6, 16.7], c: ["#14CCAD", "#F5A623", "#F43F31"] },
                { k: "ppVisceralFat", l: "Visceral Fat", v: m.visceralFat, s: [1, 9], c: ["#14CCAD", "#F5A623", "#F43F31"] },
                { k: "ppLoseFatWeightKg", l: "Fat-free Mass(kg)", v: m.fatFreeMass, s: [44.8, 55.8], c: ["#F5A623", "#14CCAD", "#0F9982"] },
              ].map((item) => {
                const std = m.dynamicStandards?.[item.k];
                const val = std?.currentValue ?? item.v;
                const standards = std?.standardArray?.length > 0 ? std.standardArray : item.s;
                const colors = std?.colorArray?.length > 0 ? std.colorArray : item.c;

                const numSegments = colors.length;

                let pos;
                if (standards.length === 1) {
                  const lo = standards[0];
                  const loPos = 100 / numSegments;
                  pos = val < lo ? (val / lo) * loPos : loPos + ((val - lo) / lo) * loPos;
                } else {
                  const lo = standards[0];
                  const hi = standards[standards.length - 1];
                  const loPos = 100 / numSegments;
                  const hiPos = (100 / numSegments) * (numSegments - 1);

                  if (val < lo) {
                    const minVal = lo - (standards[1] - lo);
                    pos = Math.max(0, (val - minVal) / (lo - minVal)) * loPos;
                  } else if (val > hi) {
                    const maxVal = hi + (hi - (standards[standards.length - 2] || (hi - 1)));
                    pos = hiPos + Math.min(1, (val - hi) / (maxVal - hi)) * (100 - hiPos);
                  } else {
                    let segIdx = 0;
                    for (let i = 0; i < standards.length - 1; i++) {
                      if (val <= standards[i + 1]) {
                        segIdx = i;
                        break;
                      }
                    }
                    const sLo = standards[segIdx];
                    const sHi = standards[segIdx + 1];
                    const pLo = ((segIdx + 1) * 100) / numSegments;
                    const pHi = ((segIdx + 2) * 100) / numSegments;
                    pos = pLo + ((val - sLo) / (sHi - sLo)) * (pHi - pLo);
                  }
                }
                const safePos = Math.min(95, Math.max(5, pos));

                return (
                  <div key={item.l} className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="text-[7px] text-gray-500 font-bold w-[75px] leading-tight flex-shrink-0">{item.l}</span>
                    <div className="flex-1 px-4 relative pt-[10px] pb-0.5">
                      <div className="absolute top-[-5px]  left-4 right-4 h-0 text-[6px] font-bold text-gray-400">
                        {standards.map((s, idx) => (
                          <span
                            key={idx}
                            className="absolute -translate-x-1/2 whitespace-nowrap"
                            style={{ left: `${((idx + 1) * 100) / numSegments}%` }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="w-full h-1 bg-gray-100 rounded-full flex overflow-hidden relative">
                        {colors.map((color, i) => (
                          <div
                            key={i}
                            className={cn(!color.startsWith('#') && color, "h-full flex-1")}
                            style={color.startsWith('#') ? { backgroundColor: color } : {}}
                          />
                        ))}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 border border-white shadow-sm z-10"
                          style={{ left: `${safePos}%`, transform: 'translate(-50%, -50%)' }}
                        />
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-slate-800 w-[25px] text-right flex-shrink-0">{val}</span>
                  </div>
                );
              })}
              <div className="text-[6.5px] leading-tight text-gray-500 font-medium px-1">
                Fat Ratio:{m.dynamicStandards?.ppFat?.standardTitle || "Standard"};
                Subcutaneous Fat:{m.dynamicStandards?.ppBodyFatSubCutKg?.standardTitle || "Standard"};
                Visceral Fat:{m.dynamicStandards?.ppVisceralFat?.standardTitle || "Standard"}
              </div>
            </div>

            <SectionHeader title="Body cell condition" />
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  {/* Extracellular Row */}
                  <div className="bg-white px-2 py-1.5 rounded shadow-sm border border-gray-100 flex items-center justify-between text-[8px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-gray-500 w-[55px] leading-tight">
                        Extracellular Water(kg)
                      </span>
                    </div>
                    <span className="font-bold text-[9px]">{m.extracellularWater}kg</span>
                    <span className="text-gray-400 text-[7px] w-[65px] text-right">
                      Standard(13.1~16.0)
                    </span>
                  </div>

                  {/* Intracellular Row */}
                  <div className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center justify-between text-[8px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-gray-500 w-[55px] leading-tight">
                        Intracellular Water(kg)
                      </span>
                    </div>
                    <span className="font-bold text-[9px]">{m.intracellularWater}kg</span>
                    <span className="text-gray-400 text-[7px] w-[65px] text-right">
                      Standard(
                      {m.dynamicStandards?.ppWaterICWKg?.standardArray?.[0] || "21.4"}~
                      {m.dynamicStandards?.ppWaterICWKg?.standardArray?.[1] || "26.2"})
                    </span>
                  </div>

                  {/* Body Cell Mass Row */}
                  <div className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center justify-between text-[8px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-gray-500 w-[55px] leading-tight">
                        Body Cell Mass(kg)
                      </span>
                    </div>
                    <span className="font-bold text-[9px]">{m.bodyCellMass}kg</span>
                    <span className="text-gray-400 text-[7px] w-[65px] text-right">
                      Standard(
                      {m.dynamicStandards?.ppCellMassKg?.standardArray?.[0] || "30.7"}~
                      {m.dynamicStandards?.ppCellMassKg?.standardArray?.[1] || "37.5"})
                    </span>
                  </div>
                </div>

                {/* Total Body Water Semi-Circle Gauge */}
                <div className="w-28 h-16 relative flex flex-col items-center justify-center pt-2 shrink-0">
                  <svg className="w-20 h-10" viewBox="0 0 100 50">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 10 50 A 40 40 0 0 1 50 10"
                      fill="none"
                      stroke="#14CCAD"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 50 10 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#6395ff"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute top-[45%] flex flex-col items-center">
                    <span className="text-[6px] text-slate-500 font-bold uppercase">
                      Total Body Water
                    </span>
                    <span className="text-[10px] font-black leading-none">
                      {m.totalBodyWater}kg
                    </span>
                    <span className="text-[7px] text-gray-400 font-bold mt-0.5">
                      (35~42)
                    </span>
                  </div>
                </div>
              </div>

              {/* Full-width summary text */}
              <div className="w-full text-[6px] text-gray-400 font-bold uppercase leading-[1.2]">
                Total Body Water:{m.dynamicStandards?.ppWaterKg?.standardTitle || "Standard"};
                Extracellular Water:{m.dynamicStandards?.ppWaterECWKg?.standardTitle || "Standard"};
                Intracellular Water:{m.dynamicStandards?.ppWaterICWKg?.standardTitle || "Standard"};
                Body Cell Mass:{m.dynamicStandards?.ppCellMassKg?.standardTitle || "Standard"};
                Water Ratio:{m.dynamicStandards?.ppWaterPercentage?.standardTitle || "Standard"}
              </div>
            </div>
          </div>

          {/* Right Column (55%) */}
          <div className="w-[55%] flex flex-col gap-1">
            <SectionHeader title="Health advice" />
            <div className="bg-white p-1.5 rounded-lg  pb-1 shadow-sm border border-gray-100 grid grid-cols-2 gap-x-3 gap-y-1 text-[8px]">
              {[
                { l: "Standard Weight", v: `${m.standardWeight}kg` },
                { l: "Weight Control", v: `${m.weightControl}kg` },
                { l: "Fat Control", v: `${m.fatControl}kg` },
                { l: "Muscle Control", v: `${m.muscleControl}kg` },
                { l: "Health Evaluation", v: m.healthEvaluation || "Sub-health" },
                { l: "Body Age", v: m.bodyAge || 35 },
                { l: "Recommended Calorie Intake", v: `${m.recommendedCalories}kcal` },
                { l: "Obesity Degree", v: m.obesityLevel || "Standard" },
                // { l: "Obesity Degree", v: `${m.obesityLevelNum}%` },
              ].map((item, idx) => (
                <div
                  key={item.l}
                  className={cn(
                    "flex justify-between border-b border-gray-50 pb-1",
                    idx >= 6 && "border-b-0 pb-1"
                  )}
                >
                  <span className="text-gray-500">{item.l}</span>
                  <span className="font-bold text-right">{item.v}</span>
                </div>
              ))}
            </div>

            <SectionHeader title="Body type analysis" />
            <div className="bg-white p-1.5 rounded shadow-sm border border-gray-100 flex flex-col gap-0.5 text-[8px]">
              <div className="flex font-bold text-gray-500 mb-1 ml-14">
                Fat Ratio
              </div>

              <div className="flex gap-1 items-stretch">
                <div className="w-14 space-y-1">
                  {["Overweight", "Standard", "Underweight"].map((label) => (
                    <div
                      key={label}
                      className="h-6 flex items-center justify-center font-medium bg-gray-50 rounded border border-gray-100 text-[7px]"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="flex-1 grid grid-cols-3 gap-1 grid-rows-3 ">
                  {[
                    "Edematous obese",
                    "Overweight muscular",
                    "Muscular overweight",
                    "Lack of exercise",
                    "Standard",
                    "Standard muscular",
                    "Lean",
                    "Lean muscular",
                    "Muscular",
                  ].map((text) => (
                    <div
                      key={text}
                      className={cn(
                        "rounded border flex items-center justify-center text-center text-[7px]",
                        text === "Overweight muscular"
                          ? "bg-gray-200 border-gray-300 font-bold"
                          : "bg-gray-50 border-gray-100 text-gray-500"
                      )}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex font-bold text-gray-500 mt-1 ml-14">
                <div className="flex-1 grid grid-cols-3 text-center">
                  <span>Insufficient</span>
                  <span>Standard</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="flex justify-center text-gray-500 font-bold mt-0.5">
                Muscle Mass
              </div>
            </div>

            <SectionHeader title="Segmental fat analysis" />
            <div className="bg-white px-1.5 py-2 rounded shadow-sm border border-gray-100 relative h-38 flex items-center justify-center overflow-hidden">
              {isDataMissing([m.leftArmFatMass, m.rightArmFatMass, m.trunkFatMass, m.leftLegFatMass, m.rightLegFatMass]) ? (
                <NoDataPlaceholder message="Segmental fat data unavailable" />
              ) : (
                <>
                  <img
                    src={fatAnatomy}
                    alt="body"
                    className="h-36 opacity-80"
                  />

                  {/* Anchor Dots */}
                  <div className="absolute top-[21%] left-[41.5%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute top-[21%] right-[41.5%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute top-[41%] left-[50%] -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute bottom-[23%] left-[44%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute bottom-[23%] right-[44%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />

                  {/* Connector Lines */}
                  <div className="absolute top-[23%] left-24 right-[58.5%] h-px bg-blue-200" />
                  <div className="absolute top-[23%] right-24 left-[58.5%] h-px bg-blue-200" />
                  <div className="absolute top-[42.5%] left-16 right-1/2 h-px bg-blue-200" />
                  <div className="absolute bottom-[24.5%] left-16 right-[56%] h-px bg-blue-200" />
                  <div className="absolute bottom-[24.5%] right-16 left-[56%] h-px bg-blue-200" />

                  {/* Left Arm */}
                  <div className="absolute top-[18%] left-4 text-[7px] text-gray-500 leading-tight">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Left arm</div>
                    Fat Mass {m.leftArmFatMass}kg
                    <br />
                    Fat Ratio {m.leftArmFatRatio}%
                  </div>

                  {/* Right Arm */}
                  <div className="absolute top-[18%] right-4 text-[7px] text-gray-500 leading-tight text-right">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Right arm</div>
                    Fat Mass {m.rightArmFatMass}kg
                    <br />
                    Fat Ratio {m.rightArmFatRatio}%
                  </div>

                  {/* Trunk */}
                  <div className="absolute top-[40%] left-4 text-[7px] text-gray-500 leading-tight">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Trunk</div>
                    Fat Mass {m.trunkFatMass}kg
                    <br />
                    Fat Ratio {m.trunkFatPercentage}%
                  </div>

                  {/* Left Leg */}
                  <div className="absolute bottom-[22%] left-4 text-[7px] text-gray-500 leading-tight">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Left leg</div>
                    Fat Mass {m.leftLegFatMass}kg
                    <br />
                    Fat Ratio {m.leftLegFatRatio}%
                  </div>

                  {/* Right Leg */}
                  <div className="absolute bottom-[22%] right-4 text-[7px] text-gray-500 leading-tight text-right">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Right leg</div>
                    Fat Mass {m.rightLegFatMass}kg
                    <br />
                    Fat Ratio {m.rightLegFatRatio}%
                  </div>
                </>
              )}
            </div>

            <SectionHeader title="Segmental muscle analysis" />
            <div className="bg-white px-1.5 py-2 rounded shadow-sm border border-gray-100 relative h-38 flex items-center justify-center overflow-hidden">
              {isDataMissing([m.leftArmMuscleMass, m.rightArmMuscleMass, m.trunkMuscleMass, m.leftLegMuscleMass, m.rightLegMuscleMass]) ? (
                <NoDataPlaceholder message="Segmental muscle data unavailable" />
              ) : (
                <>
                  <img
                    src={muscleAnatomy}
                    alt="body"
                    className="h-36 opacity-80"
                  />

                  {/* Anchor Dots */}
                  <div className="absolute top-[21%] left-[41.5%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute top-[21%] right-[41.5%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute top-[41%] left-[50%] -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute bottom-[23%] left-[44%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />
                  <div className="absolute bottom-[23%] right-[44%] w-1.5 h-1.5 bg-blue-600 rounded-full border border-white z-10" />

                  {/* Connector Lines */}
                  <div className="absolute top-[23%] left-24 right-[58.5%] h-px bg-blue-200" />
                  <div className="absolute top-[23%] right-24 left-[58.5%] h-px bg-blue-200" />
                  <div className="absolute top-[42.5%] left-16 right-1/2 h-px bg-blue-200" />
                  <div className="absolute bottom-[24.5%] left-16 right-[56%] h-px bg-blue-200" />
                  <div className="absolute bottom-[24.5%] right-16 left-[56%] h-px bg-blue-200" />

                  <div className="absolute top-[18%] left-4 text-[7px] text-gray-500 leading-tight">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Left arm</div>
                    Muscle Mass {m.leftArmMuscleMass}kg
                    <br />
                    Ratio {m.leftArmMuscleRate}%
                  </div>

                  <div className="absolute top-[18%] right-4 text-[7px] text-gray-500 leading-tight text-right">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Right arm</div>
                    Muscle Mass {m.rightArmMuscleMass}kg
                    <br />
                    Ratio {m.rightArmMuscleRate}%
                  </div>

                  <div className="absolute top-[40%] left-4 text-[7px] text-gray-500 leading-tight">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Trunk</div>
                    Muscle Mass {m.trunkMuscleMass}kg
                    <br />
                    Ratio {m.trunkMuscleRate}%
                  </div>

                  <div className="absolute bottom-[22%] left-4 text-[7px] text-gray-500 leading-tight">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Left leg</div>
                    Muscle Mass {m.leftLegMuscleMass}kg
                    <br />
                    Ratio {m.leftLegMuscleRate}%
                  </div>

                  <div className="absolute bottom-[22%] right-4 text-[7px] text-gray-500 leading-tight text-right">
                    <div className="font-bold text-slate-800 uppercase mb-0.5">Right leg</div>
                    Muscle Mass {m.rightLegMuscleMass}kg
                    <br />
                    Ratio {m.rightLegMuscleRate}%
                  </div>
                </>
              )}
            </div>

            <SectionHeader title="Body composition history" />
            <div className="bg-white p-2 rounded shadow-sm border border-gray-100 min-h-24 flex flex-col justify-center relative">
              {/* Date Header Row */}
              <div className="flex items-center w-full mb-1 border-b border-gray-50 pb-1">
                <div className="w-16 shrink-0 text-[6px] font-black text-slate-400 uppercase tracking-tighter">Scan Date</div>
                <div className="flex-1 flex justify-between items-center px-2">
                  {scans.slice(0, 8).reverse().map((s, i) => (
                    <div key={i} className="text-[5px] text-gray-400 font-bold uppercase">{format(new Date(s.timestamp), "dd/MM")}</div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col w-full">
                <SparklineHistory dataKey="weight" label="Weight (kg)" color="blue" max={120} />
                <SparklineHistory dataKey="muscleMass" label="Muscle (kg)" color="green" max={80} />
                <SparklineHistory dataKey="fatRatio" label="Fat Ratio (%)" color="yellow" max={50} />
              </div>
            </div>



            <div className="flex gap-3 items-start mt-1 px-1 py-1 bg-gray-50/50 rounded-lg border border-gray-100">
              <div className="flex flex-col items-center gap-1 w-14 shrink-0">
                <img src={scaleImage} alt="Scale" className="w-10 h-10 object-contain opacity-80" />
                <span className="text-[5px] text-gray-400 font-bold whitespace-nowrap">CF:E9:11:06:00:5E</span>
              </div>
              <div className="flex-1">
                <div className="text-[8px] font-black text-slate-800 uppercase mb-0.5">Disclaimer</div>
                <div className="text-[6px] text-gray-400 font-medium leading-tight text-justify">
                  All parameters are measured based on bioimpedance analysis technology. The data provided by this product are highly professional and practical, and its application scope should be clearly limited to the fields of health promotion and fitness guidance. It is only used as a reference for body shape control and long-term fitness testing, and is not recommended as a basis for medical data.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Logo */}
        <div className="absolute bottom-6 right-8">
          <img src={mayuraLogo} alt="" className="h-20 object-contain" />
        </div>
      </div>
    );
  }
);

PatientReportPDF.displayName = "PatientReportPDF";
