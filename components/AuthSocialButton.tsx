import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: number;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  disabled,
  className = "",
  size,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={cn(
        `inline-flex w-full justify-center rounded-md px-4 py-3 ring-1 ring-inset hover:opacity-80 
        focus:outline-offset-0 ${className}`
      )}
    >
      <Icon size={size} />
    </button>
  );
};

export default AuthSocialButton;
