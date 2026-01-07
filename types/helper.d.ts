//=================== Form Signup ===================//
interface FormSignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

//=================== Email Config ===================//
interface EmailConfig {
  service?: string;
  auth: {
    user: string;
    pass: string;
  };
}

//=================== Bottom Sheet ===================//
interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  contentClassName?: string;
  showHeader?: boolean;
  responsive?: boolean;
}

//=================== Countdown ===================//

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

//=================== Follow Steps Modal ===================//
interface FollowStepsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  steps: Step[];
  isProcessing: boolean;
  onStepClick: (step: Step) => void;
  onStepComplete: (stepId: string) => void;
}

type StepStatus = "pending" | "in-progress" | "completed";

interface Step {
  id: string;
  name: string;
  url: string;
  status: StepStatus;
}
