import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";

interface BusinessFormProps {
  onSubmit: (data: BusinessFormData) => void;
  isLoading?: boolean;
}

export interface BusinessFormData {
  businessIdea: string;
  targetRegion: string;
  industry: string;
  targetAudience: string;
  budget: string;
}

const regions = [
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia-pacific", label: "Asia Pacific" },
  { value: "latin-america", label: "Latin America" },
  { value: "middle-east-africa", label: "Middle East & Africa" },
  { value: "global", label: "Global Market" },
];

const industries = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Professional Services" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "other", label: "Other" },
];

export const BusinessForm = ({ onSubmit, isLoading = false }: BusinessFormProps) => {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessIdea: "",
    targetRegion: "",
    industry: "",
    targetAudience: "",
    budget: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.businessIdea.trim() && formData.targetRegion && formData.industry;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="shadow-xl border-0 bg-card">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-bold text-foreground">Business Validation Request</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Provide details about your business idea to receive a comprehensive validation analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <Label htmlFor="businessIdea" className="text-base font-semibold text-foreground">
                  Business Idea Description *
                </Label>
                <Textarea
                  id="businessIdea"
                  placeholder="Describe your business idea in detail. Include the problem you're solving, your proposed solution, and key features..."
                  className="mt-2 min-h-32 resize-none"
                  value={formData.businessIdea}
                  onChange={(e) => setFormData({ ...formData, businessIdea: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetRegion" className="text-base font-semibold text-foreground">
                  Target Region *
                </Label>
                <Select value={formData.targetRegion} onValueChange={(value) => setFormData({ ...formData, targetRegion: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your target market region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry" className="text-base font-semibold text-foreground">
                  Industry *
                </Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-base font-semibold text-foreground">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, millennials, healthcare professionals..."
                  className="mt-2"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-base font-semibold text-foreground">
                  Initial Budget Range
                </Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                    <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                    <SelectItem value="over-500k">Over $500,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full lg:w-auto bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    Generate Validation Report
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};