import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import segmentalAnatomy from "@/assets/segmental_fat_analysis.png";
import scaleImage from "@/assets/clinical_body_composition_scale.png";
import mayuraLogo from "@/assets/mayura_logo.png";

interface PatientBasicReportPDFProps {
  patient: any;
  latestScan: any;
  scans: any[];
  branch: any;
  device: any;
}

export const PatientBasicReportPDF = React.forwardRef<HTMLDivElement, PatientBasicReportPDFProps>(
  ({ patient, latestScan, scans }, ref) => {
    if (!latestScan) return null;
    const m = latestScan.measurement;
    const ds = m.dynamicStandards || {};

    const getRange = (key: string): [number, number] => {
      const s = ds[key];
      if (s?.standardArray?.length >= 2) return [s.standardArray[0], s.standardArray[s.standardArray.length - 1]];
      return [0, 100];
    };

    const SectionTitle = ({ title }: { title: string }) => (
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
        <span className="w-1 h-3 rounded-full bg-blue-600 shrink-0" />
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide">{title}</span>
      </div>
    );

    const bodyTypeLabels = [
      "Edematous obese", "Overweight muscular", "Muscular overweight",
      "Lack of exercise", "Standard", "Standard muscular",
      "Lean", "Lean muscular", "Muscular",
    ];

    const currentBodyType = (m.bodyType || ds.ppBodyType?.currentValue || "").trim().toLowerCase();
    const fatStdTitle = (ds.ppFat?.standardTitle || "").trim().toLowerCase();
    const muscleStdTitle = (ds.ppMuscleKg?.standardTitle || "").trim().toLowerCase();

    const weightRange = getRange("ppWeightKg");
    const skelRange = getRange("ppBodySkeletalKg");
    const fatMassR = getRange("ppBodyfatKg");
    const bmiRange = getRange("ppBMI");
    const fatRatioR = getRange("ppFat");
    const obesityR = getRange("ppObesity");

    const isSegFatMissing = [m.leftArmFatMass, m.rightArmFatMass, m.trunkFatMass, m.leftLegFatMass, m.rightLegFatMass].every((v) => !v || v === 0);
    const isSegMuscMissing = [m.leftArmMuscleMass, m.rightArmMuscleMass, m.trunkMuscleMass, m.leftLegMuscleMass, m.rightLegMuscleMass].every((v) => !v || v === 0);

    // Health score arc
    const score = Math.min(100, Math.max(0, m.healthScore || 0));
    const r = 38; const cx = 50; const cy = 54;
    const startDeg = 225; const sweepDeg = (score / 100) * 270;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const sx = cx + r * Math.cos(toRad(startDeg));
    const sy = cy + r * Math.sin(toRad(startDeg));
    const ex = cx + r * Math.cos(toRad(startDeg + sweepDeg));
    const ey = cy + r * Math.sin(toRad(startDeg + sweepDeg));
    const bgEx = cx + r * Math.cos(toRad(startDeg + 270));
    const bgEy = cy + r * Math.sin(toRad(startDeg + 270));
    const largeArc = sweepDeg > 180 ? 1 : 0;

    const SegBar = ({ value, min, max }: { value: number; min: number; max: number }) => {
      const span = max - min;
      const padded = span; // one span pad on each side
      const totalMin = min - padded;
      const totalMax = max + padded;
      const totalRange = totalMax - totalMin;
      const pct = Math.min(97, Math.max(3, ((value - totalMin) / totalRange) * 100));
      return (
        <div className="col-span-3 relative py-3 px-3">
          <div className="flex h-3 rounded overflow-hidden w-full">
            <div className="flex-1 bg-yellow-300" />
            <div className="flex-1 bg-green-400" />
            <div className="flex-1 bg-red-400" />
          </div>
          <div
            className="absolute flex flex-col items-center"
            style={{ top: "2px", left: `${pct}%`, transform: "translateX(-50%)" }}
          >
            <div className="text-[9px] font-black text-slate-800">{value}</div>
            <div className="w-0.5 bg-slate-900" style={{ height: "12px" }} />
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        id="basic-report-pdf"
        className="font-sans text-slate-800 overflow-hidden flex flex-col"
        style={{
          width: "800px",
          height: "1132px",
          boxSizing: "border-box",
          background: "linear-gradient(155deg, #bfdbfe 0%, #eff6ff 35%, #ffffff 65%)",
          padding: "16px 20px 12px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div>
          <img src={mayuraLogo} alt="logo" className="h-20 object-contain shrink-0" />
        </div>
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-2 bg-white/70 rounded-xl px-3 py-2 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-base font-black text-gray-500">
              {patient.name?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-1 font-black text-[13px] text-slate-800">
                {patient.name}
                <span className="text-blue-500 text-[11px]">&#9794;</span>
              </div>
              <div className="text-[8px] text-slate-400 font-bold">
                {format(new Date(latestScan.timestamp), "dd-MM-yyyy HH:mm")}
              </div>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-[8px] text-slate-400 font-bold">Age</div>
              <div className="font-black text-[13px] text-slate-800">{patient.age}Age</div>
            </div>
            <div className="text-center">
              <div className="text-[8px] text-slate-400 font-bold">Height</div>
              <div className="font-black text-[13px] text-slate-800">{patient.height}cm</div>
            </div>
          </div>
          <div className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
            Measurement Report
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex gap-4 mb-4">

          {/* LEFT COLUMN */}
          <div className="w-[285px] shrink-0 flex flex-col gap-4">

            {/* Health Score + Composition */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-50">
              <div className="flex items-start gap-2">
                {/* Ring */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Health Score</div>
                  <svg width="78" height="78" viewBox="0 0 100 100">
                    <path
                      d={`M ${sx} ${sy} A ${r} ${r} 0 1 1 ${bgEx} ${bgEy}`}
                      fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round"
                    />
                    {score > 0 && (
                      <path
                        d={`M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`}
                        fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round"
                      />
                    )}
                    <text x="50" y="52" textAnchor="middle" style={{ fontSize: "17px", fontWeight: "900", fill: "#1d4ed8" }}>
                      {score}
                    </text>
                    <text x="50" y="63" textAnchor="middle" style={{ fontSize: "7px", fill: "#64748b", fontWeight: "bold" }}>
                      Point
                    </text>
                  </svg>
                  <div className="text-[7px] font-bold text-slate-500 text-center leading-tight -mt-1">
                    Body composition<br />analysis
                  </div>
                  <div className="text-[7px] font-black text-slate-700 mt-1">
                    Weight({weightRange[0]}~{weightRange[1]})
                  </div>
                </div>
                {/* Composition list */}
                <div className="flex-1">
                  <div className="text-[22px] font-black text-slate-800 leading-none">{m.weight}</div>
                  <div className="text-[7px] text-slate-400 font-bold mb-2">Weight(kg)</div>
                  {[
                    { dot: "bg-blue-400", label: "Total Body Water", val: m.totalBodyWater + "kg" },
                    { dot: "bg-yellow-400", label: "Protein Mass", val: m.proteinMass + "kg" },
                    { dot: "bg-cyan-400", label: "Minerals", val: m.minerals + "kg" },
                    { dot: "bg-pink-400", label: "Fat Mass", val: m.fatMass + "kg" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0">
                      <div className={cn("w-2 h-2 rounded-full shrink-0", item.dot)} />
                      <span className="text-[9px] text-slate-600 font-bold flex-1 leading-tight">{item.label}</span>
                      <span className="text-[10px] font-black text-slate-800">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Body Type */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50">
              <SectionTitle title="Body type" />
              <div className="px-3 pb-3">
                <div className="text-[8px] font-bold text-slate-400 mb-1">Fat ratio</div>
                <div className="flex gap-1 mb-2">
                  {["Insufficient", "Overweight muscular", "Muscular overweight"].map((opt) => {
                    const isA = fatStdTitle === opt.toLowerCase() || (opt === "Overweight muscular" && fatStdTitle === "high");
                    return (
                      <div
                        key={opt}
                        className={cn(
                          "flex-1 py-1.5 text-center text-[7px] font-bold rounded border leading-tight",
                          isA ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-gray-50 border-gray-100 text-slate-500"
                        )}
                      >
                        {opt}{isA ? " ✓" : ""}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[8px] font-bold text-slate-400 mb-1">Muscle mass</div>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {bodyTypeLabels.map((opt) => {
                    const isA = currentBodyType === opt.toLowerCase();
                    return (
                      <div
                        key={opt}
                        className={cn(
                          "py-1.5 text-center text-[7px] font-bold rounded border leading-tight",
                          isA ? "bg-blue-100 border-blue-300 text-blue-800" : "bg-gray-50 border-gray-100 text-slate-500"
                        )}
                      >
                        {opt}{isA ? " ✓" : ""}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 text-[7px] text-slate-500 font-bold pt-2 border-t border-gray-50 mt-1">
                  <span>Muscle: <span className="text-slate-700">{muscleStdTitle || "Standard"}</span></span>
                  <span>Fat: <span className="text-slate-700">{fatStdTitle || "Standard"}</span></span>
                </div>
              </div>
            </div>

            {/* Other Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
              <SectionTitle title="Other metrics" />
              <table className="w-full text-[8px]">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="text-left px-3 py-1.5 font-bold">Project</th>
                    <th className="text-right px-3 py-1.5 font-bold">Measured value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Fat-free Mass", m.fatFreeMass + "kg"],
                    ["Subcutaneous Fat Mass", m.subcutaneousFatMass + "kg"],
                    ["Body Age", m.bodyAge],
                    ["Visceral Fat", m.visceralFat],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-50">
                      <td className="px-3 py-1.5 text-slate-600 font-bold">{k}</td>
                      <td className="px-3 py-1.5 text-right font-black text-slate-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Weight Control */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
              <SectionTitle title="Weight control" />
              <table className="w-full text-[8px]">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="text-left px-3 py-1.5 font-bold">Project</th>
                    <th className="text-right px-3 py-1.5 font-bold">Measured value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Standard Weight", m.standardWeight + "kg"],
                    ["Weight Control", m.weightControl + "kg"],
                    ["Fat Control", m.fatControl + "kg"],
                    ["Muscle Control", m.muscleControl + "kg"],
                    ["BMR (Basal Metabolic Rate)", m.bmr + "kcal"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-50">
                      <td className="px-3 py-1.5 text-slate-600 font-bold">{k}</td>
                      <td className="px-3 py-1.5 text-right font-black text-slate-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">

            {/* Muscle Fat Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
              <SectionTitle title="Muscle fat analysis" />
              <div
                className="grid text-[8px] font-bold border-b border-gray-100"
                style={{ gridTemplateColumns: "130px 1fr 1fr 1fr" }}
              >
                <div className="bg-blue-700 text-white px-2 py-1 text-[8px]">
                  Data<br /><span className="text-[6px] font-normal">(Normal range)</span>
                </div>
                {[
                  { label: "Low", bg: "bg-yellow-400" },
                  { label: "Normal", bg: "bg-green-500" },
                  { label: "High", bg: "bg-red-500" },
                ].map(({ label, bg }) => (
                  <div key={label} className={cn("text-center py-1 text-white text-[9px]", bg)}>{label}</div>
                ))}
              </div>
              {[
                { label: "Weight(kg)", range: `(${weightRange[0]}~${weightRange[1]})`, value: m.weight, min: weightRange[0], max: weightRange[1] },
                { label: "Skeletal Muscle Mass(kg)", range: `(${skelRange[0]}~${skelRange[1]})`, value: m.skeletalMuscleMass, min: skelRange[0], max: skelRange[1] },
                { label: "Fat Mass(kg)", range: `(${fatMassR[0]}~${fatMassR[1]})`, value: m.fatMass, min: fatMassR[0], max: fatMassR[1] },
              ].map((item) => (
                <div key={item.label} className="grid border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: "130px 1fr 1fr 1fr" }}>
                  <div className="px-2 py-1.5 border-r border-gray-100">
                    <div className="font-bold text-slate-700 text-[8px] leading-tight">{item.label}</div>
                    <div className="text-[7px] text-slate-400">{item.range}</div>
                  </div>
                  <SegBar value={item.value} min={item.min} max={item.max} />
                </div>
              ))}
            </div>

            {/* Obesity Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
              <SectionTitle title="Obesity analysis" />
              <div
                className="grid text-[8px] font-bold border-b border-gray-100"
                style={{ gridTemplateColumns: "130px 1fr 1fr 1fr" }}
              >
                <div className="bg-blue-700 text-white px-2 py-1 text-[8px]">
                  Data<br /><span className="text-[6px] font-normal">(Normal range)</span>
                </div>
                {[
                  { label: "Low", bg: "bg-yellow-400" },
                  { label: "Standard", bg: "bg-green-500" },
                  { label: "Slightly high", bg: "bg-red-500" },
                ].map(({ label, bg }) => (
                  <div key={label} className={cn("text-center py-1 text-white text-[9px]", bg)}>{label}</div>
                ))}
              </div>
              {[
                { label: "BMI (Body Mass Index)(kg/m²)", range: `(${bmiRange[0]}~${bmiRange[1]})`, value: m.bmi, min: bmiRange[0], max: bmiRange[1] },
                { label: "Fat Ratio(%)", range: `(${fatRatioR[0]}~${fatRatioR[1]})`, value: m.fatRatio, min: fatRatioR[0], max: fatRatioR[1] },
                { label: "Obesity Level", range: `(${obesityR[0]}~${obesityR[1]})`, value: m.obesityLevelNum || 100, min: obesityR[0], max: obesityR[1] },
              ].map((item) => (
                <div key={item.label} className="grid border-b border-gray-100 last:border-0" style={{ gridTemplateColumns: "130px 1fr 1fr 1fr" }}>
                  <div className="px-2 py-1.5 border-r border-gray-100">
                    <div className="font-bold text-slate-700 text-[8px] leading-tight">{item.label}</div>
                    <div className="text-[7px] text-slate-400">{item.range}</div>
                  </div>
                  <SegBar value={item.value} min={item.min} max={item.max} />
                </div>
              ))}
            </div>

            {/* Segmental Analysis */}
            <div className="flex gap-2 h-[380px] shrink-0">
              {/* Fat */}
              <div className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ background: "linear-gradient(180deg,#1e3a8a 0%,#3b82f6 100%)" }}>
                <div className="text-center text-[9px] font-black text-white py-1.5 shrink-0">
                  | Segmental fat analysis
                </div>
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  {isSegFatMissing ? (
                    <div className="text-white/40 text-[8px] font-bold text-center">No segmental data available</div>
                  ) : (
                    <>
                      <img src={segmentalAnatomy} alt="fat body" className="h-[90%] object-contain" />

                      {/* Anchor Dots */}
                      <div className="absolute top-[25%] left-[37.5%] w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute top-[25%] right-[37.5%] w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute top-[44%] left-[50%] -translate-x-1/2 w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute bottom-[25%] left-[44%] w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute bottom-[25%] right-[44%] w-1 h-1 bg-black rounded-full z-10" />

                      {/* Connector Lines */}
                      <div className="absolute top-[25.5%] left-12 right-[60.5%] h-px bg-black/50" />
                      <div className="absolute top-[25.5%] right-12 left-[60.5%] h-px bg-black/50" />
                      <div className="absolute top-[44.5%] left-14 right-[50%] h-px bg-black/50" />
                      <div className="absolute bottom-[25.5%] left-14 right-[56%] h-px bg-black/50" />
                      <div className="absolute bottom-[25.5%] right-14 left-[56%] h-px bg-black/50" />

                      <div className="absolute top-[23%] left-2 text-[7px] text-white font-bold leading-snug">
                        L:{m.leftArmFatMass}kg<br />{m.leftArmFatRatio}%
                      </div>
                      <div className="absolute top-[23%] right-2 text-[7px] text-white font-bold leading-snug text-right">
                        R:{m.rightArmFatMass}kg<br />{m.rightArmFatRatio}%
                      </div>
                      <div className="absolute top-[42%] left-2 text-[7px] text-white font-bold leading-snug">
                        B:{m.trunkFatMass}kg<br />{m.trunkFatPercentage}%
                      </div>
                      <div className="absolute bottom-[23%] left-2 text-[7px] text-white font-bold leading-snug">
                        L:{m.leftLegFatMass}kg<br />{m.leftLegFatRatio}%
                      </div>
                      <div className="absolute bottom-[23%] right-2 text-[7px] text-white font-bold leading-snug text-right">
                        R:{m.rightLegFatMass}kg<br />{m.rightLegFatRatio}%
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Muscle */}
              <div className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ background: "linear-gradient(180deg,#3b0764 0%,#7c3aed 100%)" }}>
                <div className="text-center text-[9px] font-black text-white py-1.5 shrink-0">
                  | Segmental muscle analysis
                </div>
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  {isSegMuscMissing ? (
                    <div className="text-white/40 text-[8px] font-bold text-center">No segmental data available</div>
                  ) : (
                    <>
                      <img src={segmentalAnatomy} alt="muscle body" className="h-[90%] object-contain" />

                      {/* Anchor Dots */}
                      <div className="absolute top-[25%] left-[37.5%] w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute top-[25%] right-[37.5%] w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute top-[44%] left-[50%] -translate-x-1/2 w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute bottom-[25%] left-[44%] w-1 h-1 bg-black rounded-full z-10" />
                      <div className="absolute bottom-[25%] right-[44%] w-1 h-1 bg-black rounded-full z-10" />

                      {/* Connector Lines */}
                      <div className="absolute top-[25.5%] left-12 right-[60.5%] h-px bg-black/50" />
                      <div className="absolute top-[25.5%] right-12 left-[60.5%] h-px bg-black/50" />
                      <div className="absolute top-[44.5%] left-14 right-[50%] h-px bg-black/50" />
                      <div className="absolute bottom-[25.5%] left-14 right-[56%] h-px bg-black/50" />
                      <div className="absolute bottom-[25.5%] right-14 left-[56%] h-px bg-black/50" />

                      <div className="absolute top-[23%] left-2 text-[7px] text-white font-bold leading-snug">
                        L:{m.leftArmMuscleMass}kg<br />{m.leftArmMuscleRate}%
                      </div>
                      <div className="absolute top-[23%] right-2 text-[7px] text-white font-bold leading-snug text-right">
                        R:{m.rightArmMuscleMass}kg<br />{m.rightArmMuscleRate}%
                      </div>
                      <div className="absolute top-[42%] left-2 text-[7px] text-white font-bold leading-snug">
                        B:{m.trunkMuscleMass}kg<br />{m.trunkMuscleRate}%
                      </div>
                      <div className="absolute bottom-[23%] left-2 text-[7px] text-white font-bold leading-snug">
                        L:{m.leftLegMuscleMass}kg<br />{m.leftLegMuscleRate}%
                      </div>
                      <div className="absolute bottom-[23%] right-2 text-[7px] text-white font-bold leading-snug text-right">
                        R:{m.rightLegMuscleMass}kg<br />{m.rightLegMuscleRate}%
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 bg-white/70 rounded-xl px-4 py-5 border border-blue-100 shrink-0">
          <img src={scaleImage} alt="scale" className="w-10 h-15 object-contain opacity-70 shrink-0" />
          <div className="shrink-0">
            <div className="text-[12px] font-black text-slate-700">Mayura1</div>
            <div className="text-[10px] text-slate-400 font-bold">CF:E9:11:06:00:5E</div>
          </div>
          <div className="text-[10px] text-slate-500 font-bold leading-tight flex-1 text-justify">
            Our body fat scale and app are not intended for diagnostic purposes. Be sure to talk to a healthcare professional before making any medical decisions.
          </div>
          {/* <img src={mayuraLogo} alt="logo" className="h-8 object-contain opacity-80 shrink-0" /> */}
        </div>
        <div className="flex items-center justify-end mt-4">
          <img src={mayuraLogo} alt="logo" className="h-20 object-contain opacity-80 shrink-0" />
        </div>
      </div>
    );
  }
);

PatientBasicReportPDF.displayName = "PatientBasicReportPDF";
