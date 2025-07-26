import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBusinessValidationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Business validation routes
  app.post("/api/business-validations", async (req, res) => {
    try {
      const validationData = insertBusinessValidationSchema.parse(req.body);
      const validation = await storage.createBusinessValidation(validationData);
      res.json(validation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid validation data", errors: error.errors });
      } else {
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

  const httpServer = createServer(app);
  return httpServer;
}
