
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="rounded-full border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg"
      disabled
    >
      <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      <span className="sr-only">Mode clair uniquement</span>
    </Button>
  );
}
