import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { BusinessForm, BusinessFormData } from "@/components/BusinessForm";
import { ValidationReport } from "@/components/ValidationReport";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

type AppState = "landing" | "form" | "report";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [formData, setFormData] = useState<BusinessFormData | null>(null);

  const submitValidationMutation = useMutation({
    mutationFn: (data: BusinessFormData) => 
      apiRequest("/api/business-validations", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (response) => {
      setFormData(response);
      setCurrentState("report");
      toast({
        title: "Validation Complete",
        description: "Your business idea has been successfully analyzed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Validation Failed",
        description: "There was an error processing your business validation. Please try again.",
        variant: "destructive",
      });
      console.error("Validation error:", error);
    },
  });

  const handleGetStarted = () => {
    setCurrentState("form");
  };

  const handleFormSubmit = async (data: BusinessFormData) => {
    submitValidationMutation.mutate(data);
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
        <BusinessForm onSubmit={handleFormSubmit} isLoading={submitValidationMutation.isPending} />
      )}
      
      {currentState === "report" && formData && (
        <ValidationReport formData={formData} />
      )}
    </div>
  );
};

export default Index;
