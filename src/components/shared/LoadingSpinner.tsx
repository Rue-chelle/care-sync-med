
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = 24, 
  className = "", 
  text = "Loading..." 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};
