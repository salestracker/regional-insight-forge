import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Shield, 
  Target, 
  DollarSign, 
  BarChart3, 
  Lightbulb,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface ValidationAnalysis {
  marketOpportunity: {
    marketSize: string;
    growthRate: string;
    segments: string[];
    demandTrend: string;
    marketAnalysis: string;
  };
  competitive: {
    directCompetitors: number;
    indirectCompetitors: number;
    marketShare: string;
    opportunities: string[];
    competitiveAnalysis: string;
    keyCompetitors: string[];
  };
  regulatory: {
    complexity: string;
    requirements: string[];
    timeToCompliance: string;
    regulatoryAnalysis: string;
  };
  goToMarket: {
    strategy: string;
    channels: string[];
    timeline: string;
    keyMilestones: string[];
  };
  financial: {
    revenueProjection: string;
    breakEvenTime: string;
    fundingNeeds: string;
    keyMetrics: string[];
  };
  risks: {
    level: string;
    primaryRisks: string[];
    mitigation: string[];
  };
  validation: {
    score: number;
    recommendation: string;
    nextSteps: string[];
  };
}

interface ValidationReportProps {
  formData: {
    businessIdea: string;
    targetRegion: string;
    industry: string;
    targetAudience: string;
    budget: string;
    analysisResult?: string;
  };
}

export const ValidationReport = ({ formData }: ValidationReportProps) => {
  let analysis: ValidationAnalysis | null = null;
  let hasError = false;

  try {
    if (formData.analysisResult) {
      const parsed = JSON.parse(formData.analysisResult);
      if (parsed.error || parsed.fallback) {
        hasError = true;
      } else {
        analysis = parsed as ValidationAnalysis;
      }
    }
  } catch (error) {
    console.error('Failed to parse analysis result:', error);
    hasError = true;
  }

  if (hasError || !analysis) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Business Validation Report</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analysis for <span className="font-semibold text-primary">{formData.industry}</span> business 
            targeting <span className="font-semibold text-primary">{formData.targetRegion}</span>
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The AI analysis is temporarily unavailable. Please try submitting your business idea again or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getValidationScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLevelColor = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel === "low") return "text-green-600";
    if (lowerLevel === "medium") return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Business Validation Report
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI-powered analysis for <span className="font-semibold text-primary">{formData.industry}</span> business 
          targeting <span className="font-semibold text-primary">{formData.targetRegion}</span>
        </p>
      </div>

      {/* Validation Score */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            Validation Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getValidationScoreColor(analysis.validation.score)}`}>
              {analysis.validation.score}/10
            </div>
            <p className="text-lg text-muted-foreground mb-4">{analysis.validation.recommendation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{analysis.marketOpportunity.marketSize}</div>
              <div className="text-sm text-muted-foreground">Market Size</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-accent mb-2">{analysis.marketOpportunity.growthRate}</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{analysis.competitive.directCompetitors}</div>
              <div className="text-sm text-muted-foreground">Direct Competitors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Opportunity */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Market Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Market Segments</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.marketOpportunity.segments.map((segment, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {segment}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Demand Assessment</h4>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${
                  analysis.marketOpportunity.demandTrend.toLowerCase() === 'high' ? 'bg-green-500' :
                  analysis.marketOpportunity.demandTrend.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-foreground">{analysis.marketOpportunity.demandTrend} demand potential</span>
              </div>
            </div>
          </div>
          <Separator />
          <p className="text-muted-foreground leading-relaxed">
            {analysis.marketOpportunity.marketAnalysis}
          </p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {analysis.validation.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};