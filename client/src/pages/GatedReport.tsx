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

  const handleLeadCapture = (capturedLeadData: LeadData) => {
    setLeadData(capturedLeadData);
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

  // Parse the analysis result
  let analysis;
  try {
    analysis = JSON.parse((validation as any).analysisResult || "{}");
    if (analysis.error || analysis.fallback) {
      throw new Error("Analysis not available");
    }
  } catch (parseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">Analysis Not Ready</h2>
            <p className="text-muted-foreground mb-6">
              The AI analysis for this business validation is not yet available. Please try again in a few moments.
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

  // Show lead capture form first
  if (!leadData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto">
          <LeadCaptureForm
            onSuccess={handleLeadCapture}
            businessIdea={(validation as any).businessIdea}
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