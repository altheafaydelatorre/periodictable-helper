
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MobileWarning: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <Alert className="mb-4">
      <AlertTitle>Tip for mobile users</AlertTitle>
      <AlertDescription>
        This app works best on larger screens. For optimal experience, try landscape mode. 
        Long-press for right-click functionality.
      </AlertDescription>
    </Alert>
  );
};

export default MobileWarning;
