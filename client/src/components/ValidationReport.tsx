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
            Market Opportunity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Target Market Segments</h4>
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
          <div>
            <h4 className="font-semibold text-foreground mb-3">Market Analysis</h4>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.marketOpportunity.marketAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Landscape */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Competitive Landscape
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Competition Overview</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {analysis.competitive.directCompetitors} direct competitors</li>
                <li>• {analysis.competitive.indirectCompetitors} indirect competitors</li>
                <li>• Market is {analysis.competitive.marketShare.toLowerCase()}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Key Opportunities</h4>
              <ul className="space-y-2 text-muted-foreground">
                {analysis.competitive.opportunities.map((opp, index) => (
                  <li key={index}>• {opp}</li>
                ))}
              </ul>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-foreground mb-3">Competitive Analysis</h4>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.competitive.competitiveAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Environment */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Regulatory Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Compliance Requirements</h4>
              <ul className="space-y-2 text-muted-foreground">
                {analysis.regulatory.requirements.map((req, index) => (
                  <li key={index}>• {req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Regulatory Complexity</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${
                  analysis.regulatory.complexity.toLowerCase() === 'low' ? 'bg-green-500' :
                  analysis.regulatory.complexity.toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-foreground">{analysis.regulatory.complexity} complexity</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated compliance time: {analysis.regulatory.timeToCompliance}
              </p>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-foreground mb-3">Regulatory Analysis</h4>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.regulatory.regulatoryAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Go-to-Market Strategy */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Go-to-Market Strategy (Lean Canvas)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Recommended Channels</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.goToMarket.channels.map((channel, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Timeline</h4>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-foreground">{analysis.goToMarket.timeline}</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold text-foreground mb-3">Strategy Overview</h4>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.goToMarket.strategy}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Key Milestones</h4>
            <ul className="space-y-2 text-muted-foreground">
              {analysis.goToMarket.keyMilestones.map((milestone, index) => (
                <li key={index}>• {milestone}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Financial Projections */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Financial Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">{analysis.financial.revenueProjection}</div>
              <div className="text-sm text-muted-foreground">Revenue Projection</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-accent mb-2">{analysis.financial.breakEvenTime}</div>
              <div className="text-sm text-muted-foreground">Break-even Time</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">{analysis.financial.fundingNeeds}</div>
              <div className="text-sm text-muted-foreground">Funding Needs</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">Key Metrics to Track</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.financial.keyMetrics.map((metric, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {metric}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Primary Risks</h4>
              <ul className="space-y-2 text-muted-foreground">
                {analysis.risks.primaryRisks.map((risk, index) => (
                  <li key={index}>• {risk}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Risk Mitigation</h4>
              <ul className="space-y-2 text-muted-foreground">
                {analysis.risks.mitigation.map((mitigation, index) => (
                  <li key={index}>• {mitigation}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-2xl font-bold mb-2 ${
              analysis.risks.level.toLowerCase() === 'low' ? 'text-green-600' :
              analysis.risks.level.toLowerCase() === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {analysis.risks.level} Risk Level
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps & Proof of Concept */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Action Plan & Proof of Concept
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