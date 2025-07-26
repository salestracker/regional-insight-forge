import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { BusinessForm, BusinessFormData } from "@/components/BusinessForm";
import { ValidationReport } from "@/components/ValidationReport";

type AppState = "landing" | "form" | "report";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [formData, setFormData] = useState<BusinessFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setCurrentState("form");
  };

  const handleFormSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    setFormData(data);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentState("report");
    }, 3000);
  };

  const handleBackToHome = () => {
    setCurrentState("landing");
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        onBackToHome={handleBackToHome}
        showBackButton={currentState !== "landing"}
      />
      
      {currentState === "landing" && (
        <Hero onGetStarted={handleGetStarted} />
      )}
      
      {currentState === "form" && (
        <BusinessForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}
      
      {currentState === "report" && formData && (
        <ValidationReport formData={formData} />
      )}
    </div>
  );
};

export default Index;
