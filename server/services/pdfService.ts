import { ValidationAnalysis } from "./aiService";

interface PDFReportData {
  formData: {
    businessIdea: string;
    targetRegion: string;
    industry: string;
    targetAudience: string;
    budget: string;
  };
  analysis: ValidationAnalysis;
  leadData: {
    firstName: string;
    lastName: string;
    company: string;
  };
}

export async function generatePDFReport(reportData: PDFReportData): Promise<Buffer> {
  const { formData, analysis, leadData } = reportData;
  
  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Business Validation Report - ${formData.businessIdea}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          color: #666;
          font-size: 16px;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section h2 {
          color: #2563eb;
          font-size: 20px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .section h3 {
          color: #374151;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .validation-score {
          text-align: center;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .score-number {
          font-size: 48px;
          font-weight: bold;
          color: ${analysis.validation.score >= 8 ? '#16a34a' : analysis.validation.score >= 6 ? '#eab308' : '#dc2626'};
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        .metric-card {
          background: #f1f5f9;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
        }
        .metric-value {
          font-weight: bold;
          font-size: 18px;
          color: #2563eb;
        }
        .metric-label {
          font-size: 12px;
          color: #64748b;
          margin-top: 5px;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 10px 0;
        }
        .tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .risk-level {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
          color: white;
          background: ${analysis.risks.level.toLowerCase() === 'low' ? '#16a34a' : 
                       analysis.risks.level.toLowerCase() === 'medium' ? '#eab308' : '#dc2626'};
        }
        .next-steps {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        .step {
          display: flex;
          margin-bottom: 15px;
        }
        .step-number {
          background: #2563eb;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }
        ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Business Validation Report</h1>
        <p>AI-Powered Analysis for ${formData.industry} Business targeting ${formData.targetRegion}</p>
        <p><strong>Prepared for:</strong> ${leadData.firstName} ${leadData.lastName}, ${leadData.company}</p>
        <p><strong>Business Idea:</strong> ${formData.businessIdea}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="validation-score">
        <div class="score-number">${analysis.validation.score}/10</div>
        <h3>Validation Score</h3>
        <p>${analysis.validation.recommendation}</p>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${analysis.marketOpportunity.marketSize}</div>
            <div class="metric-label">Market Size</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${analysis.marketOpportunity.growthRate}</div>
            <div class="metric-label">Growth Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${analysis.competitive.directCompetitors}</div>
            <div class="metric-label">Direct Competitors</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Market Opportunity Analysis</h2>
        <h3>Target Market Segments</h3>
        <div class="tags">
          ${analysis.marketOpportunity.segments.map(segment => `<span class="tag">${segment}</span>`).join('')}
        </div>
        <h3>Demand Assessment</h3>
        <p><strong>${analysis.marketOpportunity.demandTrend}</strong> demand potential</p>
        <h3>Market Analysis</h3>
        <p>${analysis.marketOpportunity.marketAnalysis}</p>
      </div>

      <div class="section">
        <h2>Competitive Landscape</h2>
        <ul>
          <li>${analysis.competitive.directCompetitors} direct competitors</li>
          <li>${analysis.competitive.indirectCompetitors} indirect competitors</li>
          <li>Market is ${analysis.competitive.marketShare.toLowerCase()}</li>
        </ul>
        <h3>Key Opportunities</h3>
        <ul>
          ${analysis.competitive.opportunities.map(opp => `<li>${opp}</li>`).join('')}
        </ul>
        <h3>Competitive Analysis</h3>
        <p>${analysis.competitive.competitiveAnalysis}</p>
      </div>

      <div class="section">
        <h2>Regulatory Environment</h2>
        <p><strong>Complexity:</strong> ${analysis.regulatory.complexity}</p>
        <p><strong>Estimated compliance time:</strong> ${analysis.regulatory.timeToCompliance}</p>
        <h3>Compliance Requirements</h3>
        <ul>
          ${analysis.regulatory.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
        <h3>Regulatory Analysis</h3>
        <p>${analysis.regulatory.regulatoryAnalysis}</p>
      </div>

      <div class="section">
        <h2>Go-to-Market Strategy (Lean Canvas)</h2>
        <h3>Recommended Channels</h3>
        <div class="tags">
          ${analysis.goToMarket.channels.map(channel => `<span class="tag">${channel}</span>`).join('')}
        </div>
        <h3>Timeline</h3>
        <p>${analysis.goToMarket.timeline}</p>
        <h3>Strategy Overview</h3>
        <p>${analysis.goToMarket.strategy}</p>
        <h3>Key Milestones</h3>
        <ul>
          ${analysis.goToMarket.keyMilestones.map(milestone => `<li>${milestone}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Financial Analysis</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${analysis.financial.revenueProjection}</div>
            <div class="metric-label">Revenue Projection</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${analysis.financial.breakEvenTime}</div>
            <div class="metric-label">Break-even Time</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${analysis.financial.fundingNeeds}</div>
            <div class="metric-label">Funding Needs</div>
          </div>
        </div>
        <h3>Key Metrics to Track</h3>
        <div class="tags">
          ${analysis.financial.keyMetrics.map(metric => `<span class="tag">${metric}</span>`).join('')}
        </div>
      </div>

      <div class="section">
        <h2>Risk Assessment</h2>
        <p><span class="risk-level">${analysis.risks.level} Risk Level</span></p>
        <h3>Primary Risks</h3>
        <ul>
          ${analysis.risks.primaryRisks.map(risk => `<li>${risk}</li>`).join('')}
        </ul>
        <h3>Risk Mitigation</h3>
        <ul>
          ${analysis.risks.mitigation.map(mitigation => `<li>${mitigation}</li>`).join('')}
        </ul>
      </div>

      <div class="section">
        <h2>Action Plan & Proof of Concept</h2>
        <div class="next-steps">
          ${analysis.validation.nextSteps.map((step, index) => 
            `<div class="step">
              <div class="step-number">${index + 1}</div>
              <div>${step}</div>
            </div>`
          ).join('')}
        </div>
      </div>

      <div class="footer">
        <p>This report was generated using AI-powered business validation analysis.</p>
        <p>© ${new Date().getFullYear()} BizValidator. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Use html-pdf-node for PDF generation
    const htmlPdf = require('html-pdf-node');
    
    const options = {
      format: 'A4',
      border: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      displayHeaderFooter: false,
      printBackground: true,
      preferCSSPageSize: true,
    };

    const file = {
      content: htmlContent
    };

    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
}