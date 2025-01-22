import { useToast as useToastOriginal } from "@/components/ui/toast"

export const useToast = () => {
  const { toast } = useToastOriginal()
  return { toast }
}

