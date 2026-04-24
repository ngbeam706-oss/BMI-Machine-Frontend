import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Printer, Share2, Building2, Cpu, Calendar, Phone, Mail, Activity, Dumbbell, Droplet, Flame, Zap, Settings2, AlertCircle, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { PatientReportPDF } from "@/components/PatientReportPDF";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatusBadge } from "@/components/StatusBadges";
import { MetricGroup, MetricRow, MetricSquare, MetricWide } from "@/components/MetricGroup";
import { BodySegmentDiagram } from "@/components/BodySegmentDiagram";
import { GaugeCard } from "@/components/GaugeCard";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";
import muscleAnatomy from "@/assets/3d_muscular_anatomy_human_1776422761523.png";
import fatAnatomy from "@/assets/3d_human_anatomy_with_fat_layer_1776423834660.png";

import { usePatientDetail } from "@/hooks/usePatientDetail";
import { toast } from "sonner";

export default function PatientDetail() {
  const { id } = useParams();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading: isDynamicLoading, error: dynamicError } = usePatientDetail(id);

  if (isDynamicLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  if (dynamicError) {
    console.error("Backend Fetch Error:", dynamicError);
  }

  if (!data) {
    return (
      <div className="text-center py-20 card-elevated">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h2 className="text-xl font-bold mb-2">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't retrieve the record for ID: <span className="font-mono text-primary">{id}</span></p>
        <Link to="/patients">
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Return to List</Button>
        </Link>
      </div>
    );
  }

  const { p: patient, scans, branch, device } = data;
  const latest = scans[0];
  const previous = scans[1];
  const m = latest.measurement;

  const handlePrint = async () => {
    const element = reportRef.current;
    if (!element) return;

    toast.loading("Preparing report for printing...", { id: "print-report" });

    try {
      const opt = {
        margin: 0,
        filename: `Mayurah_Report_${patient.name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      const pdfBlob = await html2pdf().from(element).set(opt).output('blob');
      const url = URL.createObjectURL(pdfBlob);

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
        toast.success("Print dialog opened", { id: "print-report" });
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 1000);
      };
    } catch (err) {
      console.error("Print error:", err);
      toast.error("Could not prepare report for printing", { id: "print-report" });
    }
  };

  const handleShare = async () => {
    const element = reportRef.current;
    if (!element) return;

    toast.loading("Preparing document for sharing...", { id: "share-report" });

    try {
      const opt = {
        margin: 0,
        filename: `Mayurah_Report_${patient.name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      const pdfBlob = await html2pdf().from(element).set(opt).output('blob');
      const file = new File([pdfBlob], opt.filename, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Health Report - ${patient.name}`,
          text: `Body composition and health insights for ${patient.name}`
        });
        toast.success("Report shared successfully", { id: "share-report" });
      } else {
        // Fallback for desktop or non-sharing browsers
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = opt.filename;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("PDF generated and downloaded (Share API not supported on this browser)", { id: "share-report" });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Share error:", err);
        toast.error("Could not share report", { id: "share-report" });
      } else {
        toast.dismiss("share-report");
      }
    }
  };

  // Check if we have advanced data (non-zero muscle mass)
  const hasAdvancedData = m.muscleMass > 0;
  const hasCompositionData = m.fatMass > 0 || m.muscleMass > 0 || m.totalBodyWater > 0;

  const trend = (key: keyof typeof m) => {
    if (!previous) return null;
    const cur = m[key] as number;
    const prev = previous.measurement[key] as number;
    return Number((cur - prev).toFixed(1));
  };

  // Composition pie (5-Component Model: Sum equals total weight)
  const otherMinerals = Math.max(0, Number((m.minerals - m.boneMass).toFixed(2)));
  const compData = [
    { name: "Fat", value: m.fatMass, color: "hsl(var(--warning))" },
    { name: "Water", value: m.totalBodyWater, color: "hsl(var(--info))" },
    { name: "Protein", value: m.proteinMass, color: "hsl(var(--accent))" },
    { name: "Bone", value: m.boneMass, color: "hsl(var(--primary))" },
    { name: "Other Minerals", value: otherMinerals, color: "hsl(var(--muted-foreground))" },
  ].filter(d => d.value > 0);

  // Radar
  const radarData = [
    { metric: "Muscle", value: Math.min(100, (m.skeletalMuscleRatio / 39) * 100) },
    { metric: "Water", value: Math.min(100, (m.waterRatio / 65) * 100) },
    { metric: "Protein", value: Math.min(100, (m.proteinRatio / 20) * 100) },
    { metric: "BMI Bal.", value: Math.max(0, 100 - Math.abs(m.bmi - 22) * 5) },
    { metric: "Low Fat", value: Math.max(0, 100 - m.fatRatio * 2.5) },
    { metric: "Health", value: m.healthScore },
  ];

  // Trends across scans
  const trendData = [...scans].reverse().map((s, i) => ({
    date: format(new Date(s.timestamp), "d MMM"),
    weight: s.measurement.weight,
    bmi: s.measurement.bmi,
    fat: s.measurement.fatRatio,
    muscle: s.measurement.skeletalMuscleMass,
    health: s.measurement.healthScore,
  }));

  // Clinical flags
  const flags: { label: string; severity: "warning" | "danger" }[] = [];
  if (m.skeletalMuscleRatio > 0 && m.skeletalMuscleRatio < 30) flags.push({ label: "Under Muscle", severity: "warning" });
  if (m.fatRatio > 0 && m.fatRatio > 28) flags.push({ label: "High Fat", severity: "danger" });
  if (m.visceralFat > 0 && m.visceralFat > 12) flags.push({ label: "High Visceral Fat", severity: "danger" });
  if (m.waterRatio > 0 && m.waterRatio < 50) flags.push({ label: "Dehydration Risk", severity: "warning" });
  if (m.bmi > 30) flags.push({ label: "Obesity Risk", severity: "danger" });
  if (m.bmi > 0 && m.bmi < 18.5) flags.push({ label: "Underweight", severity: "warning" });

  const TrendIndicator = ({ delta, inverse = false }: { delta: number | null; inverse?: boolean }) => {
    if (delta === null || delta === 0) return null;
    const isUp = delta > 0;
    const isGood = inverse ? !isUp : isUp;
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${isGood ? "text-success" : "text-destructive"}`}>
        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(delta)}
      </span>
    );
  };

  // Helper to get dynamic standard data
  const getD = (key: string) => latest.measurement.dynamicStandards?.[key];

  const isDataMissing = (values: (number | string | undefined | null)[]) => {
    return values.every(v => !v || v === 0 || v === "0" || v === "0.0");
  };

  const NoDataPlaceholder = ({ message = "Pending full body analysis" }: { message?: string }) => (
    <div className="flex-1 min-h-[300px] w-full flex flex-col items-center justify-center bg-muted/20 rounded-2xl border border-dashed border-border p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
        <Activity className="h-8 w-8 text-muted-foreground opacity-20" />
      </div>
      <h4 className="text-lg font-bold text-muted-foreground mb-2">No Data Available</h4>
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
        {message}
      </p>
    </div>
  );

  const handleDownloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `Report_${patient.id}_${format(new Date(), "yyyyMMdd")}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    setIsDownloading(true);
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Generation Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Link to="/patients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to patients
      </Link>

      {/* Profile header */}
      <div className="card-elevated overflow-hidden mb-6">
        <div className="h-8 bg-gradient-hero relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_50%)]" />
        </div>
        <div className="p-6 -mt-12 relative">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-accent shadow-elevated flex items-center justify-center border-4 border-card text-2xl font-bold text-accent-foreground">
              {patient.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">{patient.name}</h1>
                <StatusBadge status={latest.status} />
              </div>
              <p className="text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                <span>UHID: <span className="font-mono text-primary font-medium">{patient.uhid}</span></span>
                <span>DOB: <span className="font-medium text-foreground/80">{patient.dob !== "N/A" ? format(new Date(patient.dob), "dd-MM-yyyy") : "N/A"}</span></span>
                <span>{patient.gender} · {patient.age} yrs · {patient.height} cm</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 min-w-[140px]"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isDownloading ? "Generating PDF..." : "Download Report"}
              </Button>
            </div>
          </div>

          <div className="fixed pointer-events-none opacity-0 left-[-9999px] bg-white">
            <PatientReportPDF
              ref={reportRef}
              patient={patient}
              latestScan={latest}
              scans={scans}
              branch={branch}
              device={device}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-border/40 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /><span className="font-medium text-foreground/70">{branch.name.replace("Mayurah ", "")}</span></div>
            <div className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /><span className="font-medium text-foreground/70">{device.id} · {device.model}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span className="font-medium text-foreground/70">{format(new Date(latest.timestamp), "d MMM yyyy, HH:mm")}</span></div>
            <div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /><span className="font-medium text-foreground/70">{patient.phone}</span></div>
          </div>
        </div>
      </div>

      {/* Clinical Interpretation / Dynamic Insights */}
      {(m.healthEvaluation !== "N/A" || flags.length > 0) && (
        <div className="card-elevated p-4 mb-6 border-l-4 border-l-primary bg-gradient-to-r from-primary-soft/30 to-transparent">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><AlertCircle className="h-5 w-5" /></div>
              <h3 className="font-bold text-sm text-foreground">Clinical Insights</h3>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {getD("ppBodyHealth")?.standeEvaluation || (
                  m.healthEvaluation === "Excellent" ? "Patient shows excellent body composition balance. Continue current lifestyle." :
                    m.healthEvaluation === "Healthy" ? "Patient is within healthy ranges. Maintain hydration." :
                      m.healthEvaluation === "Needs Attention" ? "Some metrics fall outside optimal ranges. Recommend nutritional consult." :
                        "Multiple high-risk indicators detected. Clinical follow-up advised."
                )}
              </p>
              {getD("ppBodyHealth")?.standSuggestion && (
                <p className="text-[11px] font-medium text-primary mt-1">Suggestion: {getD("ppBodyHealth")?.standSuggestion}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {flags.map((f, i) => (
                <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${f.severity === "danger" ? "bg-destructive/5 text-destructive border-destructive/10" : "bg-warning-soft text-warning border-warning/10"}`}>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Key gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GaugeCard
          label="Health Score"
          value={m.healthScore}
          min={getD("ppBodyScore")?.standardArray?.[0] || 0}
          max={getD("ppBodyScore")?.standardArray?.[4] || 100}
          status={getD("ppBodyScore")?.standardTitle || m.healthEvaluation}
          overrideColor={getD("ppBodyScore")?.standColor}
          thresholds={{ warning: 60, danger: 50 }}
        />
        <GaugeCard
          label="BMI"
          value={m.bmi}
          max={getD("ppBMI")?.standardArray?.[1] || 25}
          min={getD("ppBMI")?.standardArray?.[0] || 18.5}
          unit="kg/m²"
          status={getD("ppBMI")?.standardTitle || m.obesityLevel}
          overrideColor={getD("ppBMI")?.standColor}
          thresholds={{ warning: 25, danger: 30 }}
        />
        {m.visceralFat > 0 && (
          <GaugeCard
            label="Visceral Fat"
            value={m.visceralFat}
            min={getD("ppVisceralFat")?.standardArray?.[0] || 1}
            max={getD("ppVisceralFat")?.standardArray?.[1] || 9}
            unit="level"
            status={getD("ppVisceralFat")?.standardTitle || (m.visceralFat > 12 ? "High" : m.visceralFat > 9 ? "Moderate" : "Normal")}
            overrideColor={getD("ppVisceralFat")?.standColor}
            thresholds={{ warning: 10, danger: 14 }}
          />
        )}
        {m.fatRatio > 0 && (
          <GaugeCard
            label="Body Fat %"
            value={m.fatRatio}
            min={getD("ppFat")?.standardArray?.[0] || 10}
            max={getD("ppFat")?.standardArray?.[1] || 20}
            unit="%"
            status={getD("ppFat")?.standardTitle || (m.fatRatio > 28 ? "High" : "Normal")}
            overrideColor={getD("ppFat")?.standColor}
            thresholds={{ warning: 25, danger: 32 }}
          />
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          {hasAdvancedData && <TabsTrigger value="composition" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Composition</TabsTrigger>}
          {hasAdvancedData && <TabsTrigger value="segmental" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Segmental</TabsTrigger>}
          <TabsTrigger value="impedance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Impedance</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Trends & History</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="card-elevated p-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <h3 className="font-bold text-sm mb-4">Composition Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={compData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {compData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full md:w-auto shrink-0">
                {compData.map((d) => (
                  <div key={d.name} className="p-2 rounded-xl bg-muted/20 border border-border/30 min-w-[100px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">{d.name}</p>
                    </div>
                    <p className="font-bold text-sm">{d.value} <span className="text-[10px] font-normal opacity-70">kg</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-4">
              <h3 className="font-bold text-sm mb-2">Anatomical Balance</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MetricGroup title="Basic Body Metrics" icon={<Activity className="h-5 w-5" />} accent="primary" isGrid gridCols={3}>
              <MetricSquare label="Weight" value={m.weight} unit="kg" min={getD("ppWeightKg")?.standardArray?.[0]} max={getD("ppWeightKg")?.standardArray?.[1]} statusText={getD("ppWeightKg")?.standardTitle} statusColor={getD("ppWeightKg")?.standColor} />
              <MetricSquare label="BMI" value={m.bmi} unit="kg/m²" min={getD("ppBMI")?.standardArray?.[0]} max={getD("ppBMI")?.standardArray?.[1]} statusText={getD("ppBMI")?.standardTitle} statusColor={getD("ppBMI")?.standColor} />
              {m.standardWeight > 0 && <MetricSquare label="Standard Wt" value={m.standardWeight} unit="kg" />}
              {m.bodyAge > 0 && <MetricSquare label="Body Age" value={m.bodyAge} unit="yrs" min={getD("ppBodyAge")?.standardArray?.[1]} max={getD("ppBodyAge")?.standardArray?.[2]} statusText={getD("ppBodyAge")?.standardTitle} statusColor={getD("ppBodyAge")?.standColor} />}
              {m.bodyType !== "N/A" && <MetricSquare label="Body Type" value={m.bodyType} statusText={getD("ppBodyType")?.standardTitle} />}

              {m.healthScore > 0 && <MetricSquare label="Health Score" value={m.healthScore} unit="/100" min={getD("ppBodyScore")?.standardArray?.[0]} max={getD("ppBodyScore")?.standardArray?.[4]} statusText={getD("ppBodyScore")?.standardTitle} statusColor={getD("ppBodyScore")?.standColor} />}
            </MetricGroup>

            <MetricGroup title="Metabolic & Health" icon={<Zap className="h-5 w-5" />} accent="warning" isGrid gridCols={3}>
              {m.bmr > 0 && <MetricSquare label="BMR" value={m.bmr} unit="kcal" min={getD("ppBMR")?.standardArray?.[0]} max={getD("ppBMR")?.standardArray?.[1]} statusText={getD("ppBMR")?.standardTitle} statusColor={getD("ppBMR")?.standColor} />}
              {m.recommendedCalories > 0 && <MetricSquare label="Recommended" value={m.recommendedCalories} unit="kcal" />}
              {m.weightControl !== 0 && <MetricSquare label="Wt Control" value={m.weightControl} unit="kg" />}
              {m.waistHipRatio > 0 && <MetricSquare label="Waist-Hip" value={m.waistHipRatio} min={getD("ppWHR")?.standardArray?.[0]} max={getD("ppWHR")?.standardArray?.[1]} statusText={getD("ppWHR")?.standardTitle} statusColor={getD("ppWHR")?.standColor} />}
              {m.obesityLevel !== "N/A" && <MetricSquare label="Obesity Lvl" value={m.obesityLevel} min={getD("ppObesity")?.standardArray?.[0]} max={getD("ppObesity")?.standardArray?.[1]} statusText={getD("ppObesity")?.standardTitle} statusColor={getD("ppObesity")?.standColor} />}
              {m.visceralFat > 0 && <MetricSquare label="Visceral Fat" value={m.visceralFat} unit="lvl" min={getD("ppVisceralFat")?.standardArray?.[0]} max={getD("ppVisceralFat")?.standardArray?.[1]} statusText={getD("ppVisceralFat")?.standardTitle} statusColor={getD("ppVisceralFat")?.standColor} />}
            </MetricGroup>
          </div>
        </TabsContent>

        {/* Composition */}
        <TabsContent value="composition" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <MetricGroup title="Muscle Metrics" icon={<Dumbbell className="h-5 w-5" />} accent="primary" isGrid gridCols={2} className="xl:col-span-1">
              <MetricWide label="Skeletal Muscle Mass" value={m.skeletalMuscleMass} unit="kg" min={getD("ppBodySkeletalKg")?.standardArray?.[0]} max={getD("ppBodySkeletalKg")?.standardArray?.[1]} statusText={getD("ppBodySkeletalKg")?.standardTitle} statusColor={getD("ppBodySkeletalKg")?.standColor} />
              <MetricWide label="Skeletal Muscle Ratio" value={m.skeletalMuscleRatio} unit="%" min={getD("ppBodySkeletal")?.standardArray?.[0]} max={getD("ppBodySkeletal")?.standardArray?.[1]} statusText={getD("ppBodySkeletal")?.standardTitle} statusColor={getD("ppBodySkeletal")?.standColor} />
              <MetricWide label="SMQI" value={m.smqi} min={getD("ppSmi")?.standardArray?.[0]} statusText={getD("ppSmi")?.standardTitle} statusColor={getD("ppSmi")?.standColor} />
              <MetricWide label="Muscle Mass" value={m.muscleMass} unit="kg" min={getD("ppMuscleKg")?.standardArray?.[0]} max={getD("ppMuscleKg")?.standardArray?.[1]} statusText={getD("ppMuscleKg")?.standardTitle} statusColor={getD("ppMuscleKg")?.standColor} />
              <MetricWide label="Muscle Rate" value={m.muscleRate} unit="%" min={getD("ppMusclePercentage")?.standardArray?.[0]} max={getD("ppMusclePercentage")?.standardArray?.[1]} statusText={getD("ppMusclePercentage")?.standardTitle} statusColor={getD("ppMusclePercentage")?.standColor} />
              <MetricWide label="Trunk Muscle Mass" value={m.trunkMuscleMass} unit="kg" statusText={getD("ppMuscleKgTrunk")?.standardTitle} />
              <MetricWide label="Trunk Muscle Rate" value={m.trunkMuscleRate} unit="%" statusText={getD("ppMuscleRateTrunk")?.standardTitle} />
              <MetricWide label="Muscle Control" value={m.muscleControl} unit="kg" statusText={getD("ppBodyMuscleControl")?.standardTitle} />
            </MetricGroup>

            <MetricGroup title="Fat Metrics" icon={<Flame className="h-5 w-5" />} accent="warning" isGrid gridCols={2} className="xl:col-span-1">
              <MetricWide label="Fat Mass" value={m.fatMass} unit="kg" min={getD("ppBodyfatKg")?.standardArray?.[0]} max={getD("ppBodyfatKg")?.standardArray?.[1]} statusText={getD("ppBodyfatKg")?.standardTitle} statusColor={getD("ppBodyfatKg")?.standColor} />
              <MetricWide label="Fat Ratio" value={m.fatRatio} unit="%" min={getD("ppFat")?.standardArray?.[0]} max={getD("ppFat")?.standardArray?.[1]} statusText={getD("ppFat")?.standardTitle} statusColor={getD("ppFat")?.standColor} />
              <MetricWide label="Subcutaneous Fat Mass" value={m.subcutaneousFatMass} unit="kg" min={getD("ppBodyFatSubCutKg")?.standardArray?.[0]} max={getD("ppBodyFatSubCutKg")?.standardArray?.[1]} statusText={getD("ppBodyFatSubCutKg")?.standardTitle} statusColor={getD("ppBodyFatSubCutKg")?.standColor} />
              <MetricWide label="Subcutaneous Fat Ratio" value={m.subcutaneousFatRatio} unit="%" min={getD("ppBodyFatSubCutPercentage")?.standardArray?.[0]} max={getD("ppBodyFatSubCutPercentage")?.standardArray?.[1]} statusText={getD("ppBodyFatSubCutPercentage")?.standardTitle} statusColor={getD("ppBodyFatSubCutPercentage")?.standColor} />
              <MetricWide label="Trunk Fat Mass" value={m.trunkFatMass} unit="kg" statusText={getD("ppBodyFatKgTrunk")?.standardTitle} />
              <MetricWide label="Trunk Fat Percentage" value={m.trunkFatPercentage} unit="%" statusText={getD("ppBodyFatRateTrunk")?.standardTitle} />
              <MetricWide label="Visceral Fat" value={m.visceralFat} unit="lvl" min={getD("ppVisceralFat")?.standardArray?.[0]} max={getD("ppVisceralFat")?.standardArray?.[1]} statusText={getD("ppVisceralFat")?.standardTitle} statusColor={getD("ppVisceralFat")?.standColor} />
              <MetricWide label="Fat Control" value={m.fatControl} unit="kg" statusText={getD("ppFatControlKg")?.standardTitle} />
            </MetricGroup>

            <MetricGroup title="Water & Minerals" icon={<Droplet className="h-5 w-5" />} accent="info" isGrid gridCols={2} className="xl:col-span-1">
              <MetricWide label="Body Water" value={m.totalBodyWater} unit="kg" min={getD("ppWaterKg")?.standardArray?.[0]} max={getD("ppWaterKg")?.standardArray?.[1]} statusText={getD("ppWaterKg")?.standardTitle} statusColor={getD("ppWaterKg")?.standColor} />
              <MetricWide label="Water Ratio" value={m.waterRatio} unit="%" min={getD("ppWaterPercentage")?.standardArray?.[0]} max={getD("ppWaterPercentage")?.standardArray?.[1]} statusText={getD("ppWaterPercentage")?.standardTitle} statusColor={getD("ppWaterPercentage")?.standColor} />
              <MetricWide label="Intra Water" value={m.intracellularWater} unit="kg" min={getD("ppWaterICWKg")?.standardArray?.[0]} max={getD("ppWaterICWKg")?.standardArray?.[1]} statusText={getD("ppWaterICWKg")?.standardTitle} statusColor={getD("ppWaterICWKg")?.standColor} />
              <MetricWide label="Extra Water" value={m.extracellularWater} unit="kg" min={getD("ppWaterECWKg")?.standardArray?.[0]} max={getD("ppWaterECWKg")?.standardArray?.[1]} statusText={getD("ppWaterECWKg")?.standardTitle} statusColor={getD("ppWaterECWKg")?.standColor} />
              <MetricWide label="Protein Mass" value={m.proteinMass} unit="kg" min={getD("ppProteinKg")?.standardArray?.[0]} max={getD("ppProteinKg")?.standardArray?.[1]} statusText={getD("ppProteinKg")?.standardTitle} statusColor={getD("ppProteinKg")?.standColor} />
              <MetricWide label="Protein Ratio" value={m.proteinRatio} unit="%" min={getD("ppProteinPercentage")?.standardArray?.[0]} max={getD("ppProteinPercentage")?.standardArray?.[1]} statusText={getD("ppProteinPercentage")?.standardTitle} statusColor={getD("ppProteinPercentage")?.standColor} />
              <MetricWide label="Minerals" value={m.minerals} unit="kg" min={getD("ppMineralKg")?.standardArray?.[0]} max={getD("ppMineralKg")?.standardArray?.[1]} statusText={getD("ppMineralKg")?.standardTitle} statusColor={getD("ppMineralKg")?.standColor} />
              <MetricWide label="Bone Mass" value={m.boneMass} unit="kg" min={getD("ppBoneKg")?.standardArray?.[0]} max={getD("ppBoneKg")?.standardArray?.[1]} statusText={getD("ppBoneKg")?.standardTitle} statusColor={getD("ppBoneKg")?.standColor} />
              <MetricWide label="Body Cell Mass" value={m.bodyCellMass} unit="kg" min={getD("ppCellMassKg")?.standardArray?.[0]} max={getD("ppCellMassKg")?.standardArray?.[1]} statusText={getD("ppCellMassKg")?.standardTitle} statusColor={getD("ppCellMassKg")?.standColor} />
              <MetricWide label="FFM" value={m.fatFreeMass} unit="kg" min={getD("ppLoseFatWeightKg")?.standardArray?.[0]} max={getD("ppLoseFatWeightKg")?.standardArray?.[1]} statusText={getD("ppLoseFatWeightKg")?.standardTitle} statusColor={getD("ppLoseFatWeightKg")?.standColor} />
            </MetricGroup>
            <div className="card-elevated p-5 xl:col-span-3">
              <h3 className="font-bold mb-5">vs Standard Range</h3>
              <div className="space-y-5">
                {[
                  { label: "BMI", value: m.bmi, key: "ppBMI", unit: "kg/m²" },
                  { label: "Fat Ratio", value: m.fatRatio, key: "ppFat", unit: "%" },
                  { label: "Water Ratio", value: m.waterRatio, key: "ppWaterPercentage", unit: "%" },
                  { label: "Protein Ratio", value: m.proteinRatio, key: "ppProteinPercentage", unit: "%" },
                  { label: "Skeletal Muscle Ratio", value: m.skeletalMuscleRatio, key: "ppBodySkeletal", unit: "%" },
                ].map((item) => {
                  const d = getD(item.key);
                  const min = d?.standardArray?.[0] ?? 0;
                  const max = d?.standardArray?.[1] ?? 100;
                  const range = max - min;
                  const padded = range * 0.4;
                  const totalMin = min - padded;
                  const totalMax = max + padded;
                  const totalRange = totalMax - totalMin;
                  const standardLeft = ((min - totalMin) / totalRange) * 100;
                  const standardWidth = (range / totalRange) * 100;
                  const valuePos = Math.min(100, Math.max(0, ((item.value - totalMin) / totalRange) * 100));
                  const inRange = item.value >= min && item.value <= max;
                  return (
                    <div key={item.label} className="flex items-center gap-8 py-3 border-b border-border/50 last:border-0">
                      {/* Metric Label */}
                      <div className="w-36 shrink-0">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{item.label}</span>
                      </div>

                      {/* Segmented Bar with Labels */}
                      <div className="flex-1 pt-5 pb-2">
                        <div className="relative">
                          {/* Segment Boundary Labels */}
                          <div className="absolute -top-4 left-0 w-full flex text-[10px] font-bold text-muted-foreground/60 tabular-nums">
                            <div className="absolute" style={{ left: `${standardLeft}%`, transform: "translateX(-50%)" }}>{min}</div>
                            <div className="absolute" style={{ left: `${standardLeft + standardWidth}%`, transform: "translateX(-50%)" }}>{max}</div>
                          </div>

                          {/* Segmented Bar */}
                          <div className="flex h-2 gap-0.5">
                            <div className="bg-warning/60 rounded-l-full" style={{ width: `${standardLeft}%` }} />
                            <div className="bg-success/70" style={{ width: `${standardWidth}%` }} />
                            <div className="bg-primary/30 rounded-r-full flex-1" />
                          </div>

                          {/* Indicator Dot */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-success border-2 border-card shadow-md z-20 transition-all duration-500"
                            style={{ left: `calc(${valuePos}% - 7px)` }}
                          />
                        </div>
                      </div>

                      {/* Current Value */}
                      <div className="w-28 shrink-0 text-right">
                        <span className={`text-xl font-black tabular-nums transition-colors duration-300 ${inRange ? "text-success" : "text-warning"}`}>
                          {item.value}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground ml-1 uppercase">{item.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Segmental */}
        <TabsContent value="segmental" className="mt-6 space-y-4">
          {isDataMissing([m.leftArmMuscleMass, m.rightArmMuscleMass, m.trunkMuscleMass, m.leftLegMuscleMass, m.rightLegMuscleMass]) ? (
            <NoDataPlaceholder message="Segmental body composition analysis is currently unavailable for this scan." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BodySegmentDiagram
                label="Segmental Muscle Analysis"
                backgroundImage={muscleAnatomy}
                primaryLabel="Muscle Mass"
                secondaryLabel="Muscle Ratio"
                values={{
                  leftArm: {
                    primary: m.leftArmMuscleMass,
                    secondary: m.leftArmMuscleRate,
                    primaryColor: getD("ppMuscleKgLeftArm")?.standColor,
                    secondaryColor: getD("ppMuscleRateLeftArm")?.standColor
                  },
                  rightArm: {
                    primary: m.rightArmMuscleMass,
                    secondary: m.rightArmMuscleRate,
                    primaryColor: getD("ppMuscleKgRightArm")?.standColor,
                    secondaryColor: getD("ppMuscleRateRightArm")?.standColor
                  },
                  trunk: {
                    primary: m.trunkMuscleMass,
                    secondary: m.trunkMuscleRate,
                    primaryColor: getD("ppMuscleKgTrunk")?.standColor,
                    secondaryColor: getD("ppMuscleRateTrunk")?.standColor
                  },
                  leftLeg: {
                    primary: m.leftLegMuscleMass,
                    secondary: m.leftLegMuscleRate,
                    primaryColor: getD("ppMuscleKgLeftLeg")?.standColor,
                    secondaryColor: getD("ppMuscleRateLeftLeg")?.standColor
                  },
                  rightLeg: {
                    primary: m.rightLegMuscleMass,
                    secondary: m.rightLegMuscleRate,
                    primaryColor: getD("ppMuscleKgRightLeg")?.standColor,
                    secondaryColor: getD("ppMuscleRateRightLeg")?.standColor
                  },
                }}
              />
              <BodySegmentDiagram
                label="Segmental Fat Analysis"
                backgroundImage={fatAnatomy}
                primaryLabel="Fat Mass"
                secondaryLabel="Fat Ratio"
                values={{
                  leftArm: {
                    primary: m.leftArmFatMass,
                    secondary: m.leftArmFatRatio,
                    primaryColor: getD("ppBodyFatKgLeftArm")?.standColor,
                    secondaryColor: getD("ppBodyFatRateLeftArm")?.standColor
                  },
                  rightArm: {
                    primary: m.rightArmFatMass,
                    secondary: m.rightArmFatRatio,
                    primaryColor: getD("ppBodyFatKgRightArm")?.standColor,
                    secondaryColor: getD("ppBodyFatRateRightArm")?.standColor
                  },
                  trunk: {
                    primary: m.trunkFatMass,
                    secondary: m.trunkFatPercentage,
                    primaryColor: getD("ppBodyFatKgTrunk")?.standColor,
                    secondaryColor: getD("ppBodyFatRateTrunk")?.standColor
                  },
                  leftLeg: {
                    primary: m.leftLegFatMass,
                    secondary: m.leftLegFatRatio,
                    primaryColor: getD("ppBodyFatKgLeftLeg")?.standColor,
                    secondaryColor: getD("ppBodyFatRateLeftLeg")?.standColor
                  },
                  rightLeg: {
                    primary: m.rightLegFatMass,
                    secondary: m.rightLegFatRatio,
                    primaryColor: getD("ppBodyFatKgRightLeg")?.standColor,
                    secondaryColor: getD("ppBodyFatRateRightLeg")?.standColor
                  },
                }}
              />
            </div>
          )}
        </TabsContent>

        {/* Impedance */}
        <TabsContent value="impedance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricGroup title="Bioimpedance @ 20 KHz" icon={<Settings2 className="h-5 w-5" />} accent="accent" isGrid gridCols={3}>
              <MetricSquare label="Left Arm" value={m.impedance.f20.leftArm} unit="Ω" />
              <MetricSquare label="Right Arm" value={m.impedance.f20.rightArm} unit="Ω" />
              <MetricSquare label="Trunk" value={m.impedance.f20.trunk} unit="Ω" />
              <MetricSquare label="Left Leg" value={m.impedance.f20.leftLeg} unit="Ω" />
              <MetricSquare label="Right Leg" value={m.impedance.f20.rightLeg} unit="Ω" />
            </MetricGroup>
            <MetricGroup title="Bioimpedance @ 100 KHz" icon={<Settings2 className="h-5 w-5" />} accent="accent" isGrid gridCols={3}>
              <MetricSquare label="Left Arm" value={m.impedance.f100.leftArm} unit="Ω" />
              <MetricSquare label="Right Arm" value={m.impedance.f100.rightArm} unit="Ω" />
              <MetricSquare label="Trunk" value={m.impedance.f100.trunk} unit="Ω" />
              <MetricSquare label="Left Leg" value={m.impedance.f100.leftLeg} unit="Ω" />
              <MetricSquare label="Right Leg" value={m.impedance.f100.rightLeg} unit="Ω" />
            </MetricGroup>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card-elevated p-4 bg-muted/5 border-dashed border-border/60">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-3 text-primary">
                <Activity className="h-4 w-4" />
                Clinical Interpretation of Multi-frequency BIA
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground leading-relaxed">
                <div>
                  <p className="font-bold text-foreground mb-1 underline decoration-primary/30 underline-offset-2">20 KHz (Extracellular)</p>
                  <p>Measurements at 20 KHz primarily reflect resistance in the extracellular water. It is a critical marker for assessing edema, fluid retention, and systemic inflammation.</p>
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1 underline decoration-primary/30 underline-offset-2">100 KHz (Total Body Water)</p>
                  <p>High-frequency current at 100 KHz penetrates cell membranes, allowing for accurate measurement of both intra and extracellular water for total body composition analysis.</p>
                </div>
              </div>
            </div>
            <div className="card-elevated p-4 flex flex-col justify-center items-center text-center bg-primary/5 border-primary/20">
              <Zap className="h-8 w-8 text-primary mb-2 opacity-40" />
              <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">Status</h5>
              <p className="text-xs font-medium text-foreground">Data mapped from clinical SDK v1.7.2</p>
            </div>
          </div>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { key: "weight", label: "Weight (kg)", color: "hsl(var(--primary))" },
              { key: "bmi", label: "BMI", color: "hsl(var(--accent))" },
              { key: "fat", label: "Fat Ratio (%)", color: "hsl(var(--warning))" },
              { key: "muscle", label: "Skeletal Muscle (kg)", color: "hsl(var(--info))" },
            ].map((c) => (
              <div key={c.key} className="card-elevated p-5">
                <h3 className="font-bold mb-3">{c.label}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Line type="monotone" dataKey={c.key} stroke={c.color} strokeWidth={3} dot={{ fill: c.color, r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold">Report History</h3>
              <p className="text-xs text-muted-foreground">{scans.length} scans · current vs previous</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
                <tr>
                  <th className="text-left font-semibold py-3 px-5">Scan Date</th>
                  <th className="text-left font-semibold py-3 px-5">Branch</th>
                  <th className="text-left font-semibold py-3 px-5">Weight</th>
                  <th className="text-left font-semibold py-3 px-5">BMI</th>
                  <th className="text-left font-semibold py-3 px-5">Fat %</th>
                  <th className="text-left font-semibold py-3 px-5">Muscle</th>
                  <th className="text-left font-semibold py-3 px-5">Health</th>
                  <th className="text-left font-semibold py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s, i) => {
                  const next = scans[i + 1];
                  const dW = next ? Number((s.measurement.weight - next.measurement.weight).toFixed(1)) : null;
                  const dB = next ? Number((s.measurement.bmi - next.measurement.bmi).toFixed(1)) : null;
                  const dF = next ? Number((s.measurement.fatRatio - next.measurement.fatRatio).toFixed(1)) : null;
                  const dM = next ? Number((s.measurement.skeletalMuscleMass - next.measurement.skeletalMuscleMass).toFixed(1)) : null;
                  const dH = next ? s.measurement.healthScore - next.measurement.healthScore : null;
                  return (
                    <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                      <td className="py-3 px-5 text-xs">{format(new Date(s.timestamp), "d MMM yyyy")}</td>
                      <td className="py-3 px-5 text-xs">{branch.name.replace("Mayurah ", "")}</td>
                      <td className="py-3 px-5 font-semibold">{s.measurement.weight} <TrendIndicator delta={dW} inverse /></td>
                      <td className="py-3 px-5 font-semibold">{s.measurement.bmi} <TrendIndicator delta={dB} inverse /></td>
                      <td className="py-3 px-5 font-semibold">{s.measurement.fatRatio} <TrendIndicator delta={dF} inverse /></td>
                      <td className="py-3 px-5 font-semibold">{s.measurement.skeletalMuscleMass} <TrendIndicator delta={dM} /></td>
                      <td className="py-3 px-5 font-semibold">{s.measurement.healthScore} <TrendIndicator delta={dH} /></td>
                      <td className="py-3 px-5"><StatusBadge status={s.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
