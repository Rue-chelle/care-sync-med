
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { isDemoUser } from "@/config/production";

interface DemoUserBannerProps {
  userId: string;
}

export const DemoUserBanner = ({ userId }: DemoUserBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoUser(userId) || dismissed) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <InfoIcon className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 flex justify-between items-center">
        <span>
          <strong>Demo Mode:</strong> You're using demo credentials. 
          Some features are limited. For production use, please create a real account.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-800 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
