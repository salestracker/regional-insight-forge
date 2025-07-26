import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BusinessFormData } from "./BusinessForm";
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
  Code
} from "lucide-react";

interface ValidationReportProps {
  formData: BusinessFormData;
}

export const ValidationReport = ({ formData }: ValidationReportProps) => {
  // Mock data - in real app, this would come from API
  const mockAnalysis = {
    marketOpportunity: {
      marketSize: "$15.2B",
      growthRate: "12.3% CAGR",
      segments: ["Enterprise", "SMB", "Startups"],
      demandTrend: "High"
    },
    competitive: {
      directCompetitors: 8,
      indirectCompetitors: 15,
      marketShare: "Fragmented",
      opportunities: ["Underserved SMB segment", "Geographic expansion", "AI integration"]
    },
    regulatory: {
      complexity: "Medium",
      requirements: ["Data Privacy (GDPR)", "Industry Compliance", "Local Business License"],
      timeToCompliance: "3-6 months"
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Business Validation Report
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive analysis for <span className="font-semibold text-primary">{formData.industry}</span> business 
          targeting <span className="font-semibold text-primary">{formData.targetRegion}</span>
        </p>
      </div>

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
              <div className="text-3xl font-bold text-primary mb-2">{mockAnalysis.marketOpportunity.marketSize}</div>
              <div className="text-sm text-muted-foreground">Market Size</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-accent mb-2">{mockAnalysis.marketOpportunity.growthRate}</div>
              <div className="text-sm text-muted-foreground">Growth Rate</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">{mockAnalysis.competitive.directCompetitors}</div>
              <div className="text-sm text-muted-foreground">Direct Competitors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Business Idea Validation */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground mb-6">1. Business Idea Validation</h2>
        
        {/* Market Opportunity */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Market Opportunity
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of market size, growth potential, and demand trends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Market Segments</h4>
                <div className="flex flex-wrap gap-2">
                  {mockAnalysis.marketOpportunity.segments.map((segment, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {segment}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Demand Assessment</h4>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-foreground">{mockAnalysis.marketOpportunity.demandTrend} demand potential</span>
                </div>
              </div>
            </div>
            <Separator />
            <p className="text-muted-foreground leading-relaxed">
              The {formData.industry} market in {formData.targetRegion} shows strong fundamentals with a current market size 
              of {mockAnalysis.marketOpportunity.marketSize} and projected growth of {mockAnalysis.marketOpportunity.growthRate}. 
              Key drivers include digital transformation initiatives and increasing demand for innovative solutions.
            </p>
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
                  <li>• {mockAnalysis.competitive.directCompetitors} direct competitors</li>
                  <li>• {mockAnalysis.competitive.indirectCompetitors} indirect competitors</li>
                  <li>• Market is {mockAnalysis.competitive.marketShare.toLowerCase()}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Key Opportunities</h4>
                <ul className="space-y-2 text-muted-foreground">
                  {mockAnalysis.competitive.opportunities.map((opp, index) => (
                    <li key={index}>• {opp}</li>
                  ))}
                </ul>
              </div>
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
                  {mockAnalysis.regulatory.requirements.map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Implementation Timeline</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={mockAnalysis.regulatory.complexity === "Medium" ? "default" : "secondary"}>
                    {mockAnalysis.regulatory.complexity} Complexity
                  </Badge>
                  <span className="text-muted-foreground">{mockAnalysis.regulatory.timeToCompliance}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 2: Lean Canvas Strategy */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground mb-6">2. Lean Canvas Go-to-Market Strategy</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problem & Solution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Problem & Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Core Problem</h4>
                <p className="text-muted-foreground text-sm">
                  Businesses in {formData.targetRegion} lack efficient solutions for {formData.industry.toLowerCase()} 
                  challenges, leading to operational inefficiencies and missed opportunities.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Proposed Solution</h4>
                <p className="text-muted-foreground text-sm">
                  AI-powered platform that streamlines {formData.industry.toLowerCase()} operations with 
                  region-specific customization and compliance features.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Value Proposition */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Value Proposition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                "The only {formData.industry.toLowerCase()} solution specifically designed for {formData.targetRegion} 
                market needs, delivering 40% efficiency gains while ensuring full regulatory compliance."
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline">Time Savings</Badge>
                <Badge variant="outline">Cost Reduction</Badge>
                <Badge variant="outline">Compliance Ready</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Streams */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">SaaS Subscriptions</span>
                <Badge>Primary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Professional Services</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">API Access</span>
                <Badge variant="outline">Growth</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Monthly Recurring Revenue (MRR)</span>
                <Badge>Primary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Customer Acquisition Cost (CAC)</span>
                <Badge variant="outline">Efficiency</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Net Promoter Score (NPS)</span>
                <Badge variant="outline">Retention</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 3: PoC Recommendations */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground mb-6">3. Proof-of-Concept Development Recommendations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* No-Code Platforms */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Recommended No/Low-Code Platforms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-foreground">Bubble</h4>
                    <Badge>Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Perfect for complex web applications with database functionality and user management.
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-foreground">Webflow</h4>
                    <Badge variant="outline">Alternative</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent for marketing sites and content-driven platforms with professional design.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Recommended AI Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-foreground">Claude API</h4>
                    <Badge>Best Fit</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Superior reasoning capabilities for complex business analysis and content generation.
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-foreground">OpenAI GPT-4</h4>
                    <Badge variant="outline">Alternative</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reliable option with extensive integration ecosystem and proven performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};