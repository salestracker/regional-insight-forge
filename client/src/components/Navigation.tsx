import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft } from "lucide-react";

interface NavigationProps {
  onBackToHome?: () => void;
  showBackButton?: boolean;
}

export const Navigation = ({ onBackToHome, showBackButton = false }: NavigationProps) => {
  return (
    <nav className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {showBackButton && onBackToHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">BizValidator</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Business Analysis</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Sample Reports
            </Button>
            <Button variant="ghost" size="sm">
              Help
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};