import logoImage from "@/assets/Mayura-MyAiDoctor-Logo.pdf-removebg-preview.png";

export const Logo = ({ className = "", showText = true }: { className?: string; showText?: boolean }) => (
  <div className={`flex items-center ${className}`}>
    <img 
      src={logoImage} 
      alt="Mayurah AI" 
      className={`${showText ? "h-10" : "h-8"} w-auto object-contain`}
    />
  </div>
);
