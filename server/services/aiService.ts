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
You are a business validation expert. Analyze the following business idea and provide a comprehensive validation report.

Business Details:
- Idea: ${formData.businessIdea}
- Target Region: ${formData.targetRegion}
- Industry: ${formData.industry}
- Target Audience: ${formData.targetAudience}
- Budget: ${formData.budget}

Please provide a detailed analysis in JSON format with the following structure:
{
  "marketOpportunity": {
    "marketSize": "estimated market size with currency",
    "growthRate": "growth rate with percentage and timeframe",
    "segments": ["array of 3-5 market segments"],
    "demandTrend": "High/Medium/Low",
    "marketAnalysis": "detailed market analysis paragraph"
  },
  "competitive": {
    "directCompetitors": number_of_direct_competitors,
    "indirectCompetitors": number_of_indirect_competitors,
    "marketShare": "market concentration description",
    "opportunities": ["array of competitive opportunities"],
    "competitiveAnalysis": "detailed competitive landscape analysis",
    "keyCompetitors": ["array of 3-5 key competitors"]
  },
  "regulatory": {
    "complexity": "Low/Medium/High",
    "requirements": ["array of regulatory requirements"],
    "timeToCompliance": "estimated time",
    "regulatoryAnalysis": "detailed regulatory environment analysis"
  },
  "goToMarket": {
    "strategy": "recommended go-to-market strategy",
    "channels": ["array of recommended channels"],
    "timeline": "estimated timeline",
    "keyMilestones": ["array of key milestones"]
  },
  "financial": {
    "revenueProjection": "revenue projection with timeframe",
    "breakEvenTime": "estimated break-even time",
    "fundingNeeds": "estimated funding requirements",
    "keyMetrics": ["array of key financial metrics to track"]
  },
  "risks": {
    "level": "Low/Medium/High",
    "primaryRisks": ["array of primary risks"],
    "mitigation": ["array of risk mitigation strategies"]
  },
  "validation": {
    "score": numeric_score_1_to_10,
    "recommendation": "overall recommendation",
    "nextSteps": ["array of recommended next steps"]
  }
}

Be specific, realistic, and provide actionable insights. Base your analysis on the target region and industry provided.
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