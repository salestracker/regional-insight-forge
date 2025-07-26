# BizValidator - AI-Powered Business Validation Platform

## Overview
BizValidator is a comprehensive business idea validation platform that provides AI-powered market analysis, competitive research, and go-to-market strategy recommendations. The application helps entrepreneurs and businesses validate their ideas with data-driven insights tailored to their target region and industry.

## Project Architecture
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Routing**: Wouter (Replit-compatible routing library)
- **State Management**: React useState for local state, TanStack Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Storage**: In-memory storage (MemStorage) as specified in guidelines

## Recent Changes
- 2025-01-26: Integrated DeepSeek AI for dynamic business validation analysis
- 2025-01-26: Created AI service to generate comprehensive validation reports
- 2025-01-26: Updated backend routes to call DeepSeek API for analysis
- 2025-01-26: Modified ValidationReport component to display AI-generated insights
- 2025-01-26: Added proper error handling for AI analysis failures
- 2025-01-26: Implemented complete lead capture and PDF download system
- 2025-01-26: Added HubSpot integration for automatic lead creation
- 2025-01-26: Created gated access flow requiring contact details before report viewing
- 2025-01-26: Built PDF generation service for comprehensive business validation reports

## Features
1. **Landing Page**: Hero section with feature overview and call-to-action
2. **Business Form**: Multi-step form for collecting business idea details
3. **AI-Powered Validation Report**: Comprehensive analysis using DeepSeek AI including:
   - Market opportunity analysis with region-specific insights
   - Competitive landscape assessment
   - Regulatory environment analysis
   - Lean Canvas go-to-market strategy
   - Financial projections and risk assessment
   - Actionable next steps with no/low-code recommendations
4. **Navigation**: Clean navigation with back button functionality

## Key Components
- Hero: Landing page with feature overview
- BusinessForm: Form for collecting business validation data
- ValidationReport: Displays comprehensive analysis results
- Navigation: Top navigation bar with branding and navigation

## User Preferences
- None specified yet

## Development Status
- ✓ Dependencies installed (sonner, react-router-dom)
- ✓ Routing system migrated to Wouter for Replit compatibility
- ✓ Data schemas updated for business validation functionality
- ✓ Storage interface and API routes created
- ✓ Frontend connected to backend with TanStack Query
- ✓ Migration from Lovable to Replit completed successfully
- ✓ Application fully functional and ready for further development