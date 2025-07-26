// Define BusinessFormData type here since we can't import from client
interface BusinessFormData {
  businessIdea: string;
  targetRegion: string;
  industry: string;
  targetAudience: string;
  budget: string;
}

export interface ValidationAnalysis {
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

export async function generateValidationReport(formData: BusinessFormData): Promise<ValidationAnalysis> {
  const prompt = `
**Role & Expertise:**
You are a seasoned business strategist and go-to-market expert specializing in launching and validating innovative business ideas globally. Your role is to analyze user-selected business concepts through comprehensive validation, crafting detailed, actionable reports tailored specifically to their chosen regions.

**Business Details to Analyze:**
- Business Idea: ${formData.businessIdea}
- Target Region: ${formData.targetRegion}
- Industry: ${formData.industry}
- Target Audience: ${formData.targetAudience}
- Budget: ${formData.budget}

**Analysis Requirements:**

1. **Business Idea Validation (Comprehensive):**
   • Market Opportunity: Evaluate market size, growth potential, target customer segments, and demand trends for ${formData.industry} in ${formData.targetRegion}
   • Competitive Landscape: Detailed competitor analysis including strengths, weaknesses, differentiation opportunities, and threats specific to ${formData.targetRegion}
   • Regulatory Environment: Identify region-specific regulations, compliance risks, and legal considerations for ${formData.industry} in ${formData.targetRegion}
   • Consumer Insights: Provide insights into regional consumer behavior, buying patterns, cultural considerations, and potential market fit for ${formData.targetAudience}

2. **Go-to-Market Strategy (Lean Canvas Approach):**
   Structure recommendations following Ash Maurya's Lean Canvas methodology:
   • Problem: Core problems addressed by "${formData.businessIdea}" in ${formData.targetRegion}
   • Customer Segments: Precise customer segments for ${formData.targetAudience} in regional context
   • Unique Value Proposition: Compelling differentiated value proposition for ${formData.targetRegion}
   • Solution: Lean validated solution tailored for ${formData.targetRegion} market
   • Channels: Optimal channels for customer acquisition in ${formData.targetRegion}
   • Revenue Streams & Cost Structures: Monetization models specific to ${formData.targetRegion} with ${formData.budget} budget consideration

3. **Proof-of-Concept Development:**
   Provide actionable next steps for rapid prototyping using:
   • No/Low Code Platforms: Recommend specific platforms best aligned with "${formData.businessIdea}" and ${formData.targetRegion} requirements
   • Generative AI: Suggest optimal GenAI tools based on use case specificity and regional accessibility

**Required JSON Output Format:**
{
  "marketOpportunity": {
    "marketSize": "specific market size estimate with currency for ${formData.targetRegion}",
    "growthRate": "growth rate with percentage and timeframe",
    "segments": ["3-5 specific market segments for ${formData.targetAudience}"],
    "demandTrend": "High/Medium/Low",
    "marketAnalysis": "detailed market analysis paragraph specific to ${formData.industry} in ${formData.targetRegion}"
  },
  "competitive": {
    "directCompetitors": number_of_direct_competitors,
    "indirectCompetitors": number_of_indirect_competitors,
    "marketShare": "market concentration description",
    "opportunities": ["specific competitive opportunities in ${formData.targetRegion}"],
    "competitiveAnalysis": "detailed competitive landscape analysis for ${formData.targetRegion}",
    "keyCompetitors": ["3-5 key competitors specific to ${formData.targetRegion}"]
  },
  "regulatory": {
    "complexity": "Low/Medium/High",
    "requirements": ["specific regulatory requirements for ${formData.industry} in ${formData.targetRegion}"],
    "timeToCompliance": "estimated time",
    "regulatoryAnalysis": "detailed regulatory environment analysis for ${formData.targetRegion}"
  },
  "goToMarket": {
    "strategy": "lean canvas-based go-to-market strategy for ${formData.targetRegion}",
    "channels": ["optimal channels for ${formData.targetAudience} in ${formData.targetRegion}"],
    "timeline": "realistic timeline considering ${formData.budget}",
    "keyMilestones": ["specific milestones for ${formData.targetRegion} market entry"]
  },
  "financial": {
    "revenueProjection": "realistic revenue projection for ${formData.targetRegion} with timeframe",
    "breakEvenTime": "estimated break-even time considering ${formData.budget}",
    "fundingNeeds": "funding requirements beyond ${formData.budget}",
    "keyMetrics": ["KPIs specific to ${formData.industry} in ${formData.targetRegion}"]
  },
  "risks": {
    "level": "Low/Medium/High",
    "primaryRisks": ["specific risks for ${formData.industry} in ${formData.targetRegion}"],
    "mitigation": ["region-specific risk mitigation strategies"]
  },
  "validation": {
    "score": numeric_score_1_to_10,
    "recommendation": "overall professional recommendation based on comprehensive analysis",
    "nextSteps": ["actionable next steps including no/low-code platforms and GenAI tools recommendations"]
  }
}

Provide specific, realistic, and actionable insights based on professional business validation methodologies. Focus on region-specific opportunities and challenges.
`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a business validation expert with deep knowledge of market analysis, competitive research, and go-to-market strategies. Always respond with valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const analysis = JSON.parse(content);
      return analysis as ValidationAnalysis;
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI service');
    }
  } catch (error) {
    console.error('Error generating validation report:', error);
    throw new Error('Failed to generate validation report');
  }
}