import { Button } from "./ui/button"

interface AcceptButtonProps {
  onClick: () => void,
  isLoading?: boolean,
  className?: string,
  children?: React.ReactNode;
}

export default function AcceptButton({
  onClick,
  isLoading = false,
  className,
  children
}: AcceptButtonProps) {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  )
}
