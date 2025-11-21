
import { Button } from "./ui/button"

interface CancelButtonProps {
  onClick: () => void,
  isLoading?: boolean,
  className?: string,
  children?: React.ReactNode;
}

export default function CancelButton({
  onClick,
  isLoading = false,
  children
}: CancelButtonProps) {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      className="bg-gray-200 border text-black"

    >
      {children}
    </Button>
  )
}
