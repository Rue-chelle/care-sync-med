
import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SuccessNotificationProps {
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const SuccessNotification = ({
  title,
  message,
  show,
  onClose,
  autoHide = true,
  duration = 5000
}: SuccessNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, autoHide, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <Card className="bg-green-50 border-green-200 p-4 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-green-800">{title}</h4>
            <p className="text-sm text-green-700 mt-1">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-green-600 hover:text-green-800 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};
