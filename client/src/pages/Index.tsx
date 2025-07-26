import { useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { BusinessForm, BusinessFormData } from "@/components/BusinessForm";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

type AppState = "landing" | "form";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [, setLocation] = useLocation();

  const submitValidationMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      // Create validation record immediately
      const validation = await apiRequest("/api/business-validations/quick", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      // Start AI analysis in background (don't wait for it)
      apiRequest(`/api/business-validations/${validation.id}/analyze`, {
        method: "POST",
      }).catch(error => {
        console.error("Background AI analysis failed:", error);
      });
      
      return validation;
    },
    onSuccess: (response) => {
      toast({
        title: "Analysis Started",
        description: "Please provide your contact details while we generate your validation report.",
      });
      // Redirect to the gated report page immediately
      setLocation(`/report/${response.id}`);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error saving your business details. Please try again.",
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
      

    </div>
  );
};

export default Index;
