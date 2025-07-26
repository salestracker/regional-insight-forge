import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBusinessValidationSchema } from "@shared/schema";
import { generateValidationReport } from "./services/aiService";
import { createHubSpotLead, type LeadData } from "./services/hubspotService";
import { generatePDFReport } from "./services/pdfService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Quick business validation endpoint - creates validation without AI analysis
  app.post("/api/business-validations/quick", async (req, res) => {
    try {
      const validationData = insertBusinessValidationSchema.parse(req.body);
      
      // Create the validation record immediately without AI analysis
      const validation = await storage.createBusinessValidation(validationData);
      
      res.json(validation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      } else {
        console.error('Validation creation error:', error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Trigger AI analysis for a validation
  app.post("/api/business-validations/:id/analyze", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid validation ID" });
        return;
      }

      const validation = await storage.getBusinessValidation(id);
      if (!validation) {
        res.status(404).json({ message: "Validation not found" });
        return;
      }

      // Generate AI analysis
      try {
        const analysis = await generateValidationReport({
          businessIdea: validation.businessIdea,
          targetRegion: validation.targetRegion,
          industry: validation.industry,
          targetAudience: validation.targetAudience,
          budget: validation.budget
        });
        
        // Update the validation with the analysis result
        const updatedValidation = await storage.updateBusinessValidation(validation.id, {
          analysisResult: JSON.stringify(analysis)
        });
        
        res.json(updatedValidation);
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        res.status(500).json({
          message: "Analysis failed",
          error: "Failed to generate AI analysis. Please try again.",
          fallback: true
        });
      }
    } catch (error) {
      console.error('Analysis trigger error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Business validation routes
  app.post("/api/business-validations", async (req, res) => {
    try {
      const validationData = insertBusinessValidationSchema.parse(req.body);
      
      // Create the validation record first
      const validation = await storage.createBusinessValidation(validationData);
      
      // Generate AI analysis
      try {
        const analysis = await generateValidationReport(validationData);
        
        // Update the validation with the analysis result
        const updatedValidation = await storage.updateBusinessValidation(validation.id, {
          analysisResult: JSON.stringify(analysis)
        });
        
        res.json(updatedValidation);
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        // Return the validation without analysis if AI fails
        res.json({
          ...validation,
          analysisResult: JSON.stringify({
            error: "Analysis temporarily unavailable. Please try again later.",
            fallback: true
          })
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      } else {
        console.error('Validation creation error:', error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/business-validations", async (req, res) => {
    try {
      const validations = await storage.getAllBusinessValidations();
      res.json(validations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/business-validations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid validation ID" });
        return;
      }
      
      const validation = await storage.getBusinessValidation(id);
      if (!validation) {
        res.status(404).json({ message: "Validation not found" });
        return;
      }
      
      res.json(validation);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lead creation endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadSchema = z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        company: z.string().min(1),
        jobTitle: z.string().min(1),
        phone: z.string().min(1),
        country: z.string().min(1),
        industry: z.string().min(1),
        companySize: z.string().min(1),
        businessGoals: z.string().optional(),
        businessIdea: z.string().min(1),
        source: z.string().min(1),
      });

      const leadData = leadSchema.parse(req.body);

      // Create lead in HubSpot
      const hubspotLead = await createHubSpotLead(leadData as LeadData);

      res.json({
        success: true,
        leadId: hubspotLead.id,
        hubspotId: hubspotLead.hubspotId,
        isNew: hubspotLead.isNew,
        message: hubspotLead.isNew ? "Lead created successfully" : "Lead already exists - updated information",
      });
    } catch (error) {
      console.error('Lead creation error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        res.status(500).json({ 
          message: "Failed to create lead", 
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  // PDF download endpoint
  app.post("/api/business-validations/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid validation ID" });
        return;
      }

      const { leadData } = req.body;
      if (!leadData || !leadData.firstName || !leadData.lastName) {
        res.status(400).json({ message: "Lead data is required for PDF download" });
        return;
      }

      const validation = await storage.getBusinessValidation(id);
      if (!validation) {
        res.status(404).json({ message: "Validation not found" });
        return;
      }

      if (!validation.analysisResult) {
        res.status(400).json({ message: "Analysis not available for this validation" });
        return;
      }

      const analysis = JSON.parse(validation.analysisResult);
      
      const reportData = {
        formData: {
          businessIdea: validation.businessIdea,
          targetRegion: validation.targetRegion,
          industry: validation.industry,
          targetAudience: validation.targetAudience,
          budget: validation.budget,
        },
        analysis,
        leadData: {
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          company: leadData.company,
        },
      };

      const pdfBuffer = await generatePDFReport(reportData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="business-validation-report-${id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      res.end(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ 
        message: "Failed to generate PDF", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
