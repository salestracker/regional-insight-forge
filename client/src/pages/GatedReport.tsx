import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { ValidationReport } from "@/components/ValidationReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  country: string;
  industry: string;
  companySize: string;
  businessGoals?: string;
}

export const GatedReport = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch the validation data
  const { data: validation, isLoading, error } = useQuery({
    queryKey: ["/api/business-validations", id],
    enabled: !!id && !isNaN(Number(id)),
  });

  const downloadPDFMutation = useMutation({
    mutationFn: async (leadData: LeadData) => {
      const response = await fetch(`/api/business-validations/${id}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to download PDF");
      }

      return response.blob();
    },
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `business-validation-report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Complete",
        description: "Your business validation report has been downloaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download PDF",
        variant: "destructive",
      });
    },
  });

  const analyzeValidationMutation = useMutation({
    mutationFn: () => 
      apiRequest(`/api/business-validations/${id}/analyze`, {
        method: "POST",
      }),
    onSuccess: () => {
      // Refetch the validation data to get the updated analysis
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "There was an error generating your business analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Parse the analysis result early so we can use isAnalysisReady in useEffect
  let analysis;
  let isAnalysisReady = false;
  if (validation) {
    try {
      analysis = JSON.parse((validation as any).analysisResult || "{}");
      if (analysis.error || analysis.fallback) {
        throw new Error("Analysis not available");
      }
      isAnalysisReady = true;
    } catch (parseError) {
      // Analysis not ready yet
    }
  }

  // Auto-refresh every 5 seconds when analysis is pending
  useEffect(() => {
    if (leadData && !isAnalysisReady) {
      const interval = setInterval(() => {
        window.location.reload();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [leadData, isAnalysisReady]);

  const handleLeadCapture = (capturedLeadData: LeadData) => {
    setLeadData(capturedLeadData);
    // No need to trigger analysis here - it's already running in background
  };

  const handleDownload = async () => {
    if (!leadData) return;
    
    setIsDownloading(true);
    try {
      await downloadPDFMutation.mutateAsync(leadData);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGoBack = () => {
    setLocation("/");
  };

  if (!id || isNaN(Number(id))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Invalid Report ID</h2>
            <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist.</p>
            <Button onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading Report</h2>
            <p className="text-muted-foreground">Please wait while we prepare your business validation report...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !validation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Report Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The business validation report you're looking for could not be found or is not yet ready.
            </p>
            <Button onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show beautiful loading state if lead captured but analysis not ready
  if (leadData && !isAnalysisReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="text-center py-16">
            <div className="mb-8">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6">
                  <svg className="w-24 h-24 animate-spin text-primary" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="31.416"
                      strokeDashoffset="31.416"
                      className="animate-pulse"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        dur="2s"
                        values="0 31.416;15.708 15.708;0 31.416"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Generating Your Business Analysis
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Our AI is analyzing your business idea "{(validation as any).businessIdea}" 
              and creating a comprehensive validation report with market insights, competitive analysis, and strategic recommendations.
            </p>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Analyzing market opportunities...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-sm text-muted-foreground">Researching competitive landscape...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-sm text-muted-foreground">Developing go-to-market strategy...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <span className="text-sm text-muted-foreground">Finalizing recommendations...</span>
              </div>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
              <p>Hello {leadData.firstName}! This usually takes 30-60 seconds.</p>
              <p className="mt-2">This page will automatically refresh when your report is ready.</p>
            </div>
            

          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if analysis failed after lead capture
  if (leadData && !isAnalysisReady && !analyzeValidationMutation.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Analysis In Progress</h2>
            <p className="text-muted-foreground mb-6">
              Your business analysis is being generated. This page will automatically refresh when ready.
            </p>
            <div className="space-y-4">
              <Button onClick={() => analyzeValidationMutation.mutate()} className="w-full">
                Retry Analysis
              </Button>
              <Button variant="outline" onClick={handleGoBack} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show lead capture form first
  if (!leadData) {
    const businessIdeaValue = (validation as any)?.businessIdea || "";
    console.log("Passing businessIdea to LeadCaptureForm:", businessIdeaValue);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <LeadCaptureForm
            onSuccess={handleLeadCapture}
            businessIdea={businessIdeaValue}
          />
        </div>
      </div>
    );
  }

  // Show the report with download option
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto">
        {/* Header with Download Button */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Welcome back, <span className="font-semibold">{leadData.firstName} {leadData.lastName}</span>
              </div>
              <Button
                onClick={handleDownload}
                disabled={isDownloading || downloadPDFMutation.isPending}
                className="shadow-lg"
              >
                {isDownloading || downloadPDFMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <ValidationReport formData={validation as any} analysis={analysis} />
      </div>
    </div>
  );
};