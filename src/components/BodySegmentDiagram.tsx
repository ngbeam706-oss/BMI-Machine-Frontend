import { cn } from "@/lib/utils";

interface SegmentData {
  primary: number;
  secondary: number;
  primaryColor?: string;
  secondaryColor?: string;
}

interface BodySegmentDiagramProps {
  values: {
    leftArm: SegmentData;
    rightArm: SegmentData;
    trunk: SegmentData;
    leftLeg: SegmentData;
    rightLeg: SegmentData;
  };
  primaryLabel: string;
  secondaryLabel: string;
  unit?: string;
  label?: string;
  backgroundImage?: string;
}

export function BodySegmentDiagram({
  values,
  primaryLabel,
  secondaryLabel,
  unit = "kg",
  label = "Segmental Distribution",
  backgroundImage
}: BodySegmentDiagramProps) {

  const Label = ({
    title,
    data,
    side,
    className
  }: {
    title: string;
    data: SegmentData;
    side: "left" | "right";
    className?: string;
  }) => (
    <div className={cn(
      "absolute flex flex-col w-40",
      side === "left" ? "items-start text-left" : "items-end text-right",
      className
    )}>
      <h4 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider mb-0.5">{title}</h4>
      <div className="flex flex-col gap-0">
        <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
          {primaryLabel} <span className="font-bold" style={{ color: data.primaryColor || "rgb(51 65 85)" }}>{data.primary}{unit}</span>
        </p>
        <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
          {secondaryLabel} <span className="font-bold" style={{ color: data.secondaryColor || "rgb(51 65 85)" }}>{data.secondary}%</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="card-elevated p-6 overflow-hidden" style={{ backgroundColor: "#f4f4f4" }}>
      <h3 className="font-bold text-lg mb-2">{label}</h3>
      <div className="relative w-full max-w-[450px] aspect-[1/0.9] mx-auto">
        {/* Background Image */}
        <div className="absolute inset-x-[10%] inset-y-0 z-0">
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt="Anatomy"
              className="w-full h-full object-contain pointer-events-none opacity-90"
            />
          )}
        </div>

        {/* SVG Pointer Lines & Hotspots */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 500 450">
          {/* Points & Lines - Normalized to 500x450 viewBox */}

          {/* Left Arm Point (hotspot) and line */}
          <circle cx="210" cy="115" r="4" className="fill-primary shadow-glow " />
          <line x1="130" y1="115" x2="210" y2="115" className="stroke-slate-300 " strokeWidth="1" />

          {/* Right Arm Point and line */}
          <circle cx="290" cy="115" r="4" className="fill-primary" />
          <line x1="290" y1="115" x2="370" y2="115" className="stroke-slate-300" strokeWidth="1" />

          {/* Trunk Point and line */}
          <circle cx="250" cy="200" r="4" className="fill-primary" />
          <line x1="150" y1="200" x2="250" y2="200" className="stroke-slate-300" strokeWidth="1" />

          {/* Left Leg Point and line */}
          <circle cx="238" cy="340" r="4" className="fill-primary" />
          <line x1="120" y1="340" x2="238" y2="340" className="stroke-slate-300" strokeWidth="1" />

          {/* Right Leg Point and line */}
          <circle cx="262" cy="340" r="4" className="fill-primary" />
          <line x1="262" y1="340" x2="380" y2="340" className="stroke-slate-300" strokeWidth="1" />
        </svg>

        {/* Labels Content */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Label title="Left Arm" data={values.leftArm} side="left" className="left-0 top-[18%]" />
          <Label title="Right Arm" data={values.rightArm} side="right" className="right-0 top-[18%]" />
          <Label title="Trunk" data={values.trunk} side="left" className="left-[2%] top-[37%]" />
          <Label title="Left Leg" data={values.leftLeg} side="left" className="left-0 bottom-[16%]" />
          <Label title="Right Leg" data={values.rightLeg} side="right" className="right-0 bottom-[16%]" />
        </div>
      </div>
    </div>
  );
}
