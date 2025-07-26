import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Lightbulb, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const preVettedIdeas = [
  { id: 1, title: "Dr. AI App", description: "A medical app with features such as skin scan diagnosis, symptom quiz, medical chatbot, and history tracking aimed at concerned parents with influencer marketing focusing on shareability and ease of use, utilizing a weekly pricing model ($4-7/week)" },
  { id: 2, title: "Advanced Voice Notes App", description: "An AI-powered voice notes app that creates summaries, allows \"interviews\" with recordings and enables deeper context gathering. Designed for those recording thoughts while walking and team communication" },
  { id: 3, title: "Personalized Data Science Marketplace", description: "A platform where users can post personal or business datasets and set bounties for AI predictions using GPT-4. The aim is personalized science with broad userbase like Kaggle" },
  { id: 4, title: "Great Books Reimagined", description: "An AI platform that provides modern translations of classic literature and formats it for students or professionals with multimedia additions. Making them more accessible for broad markets" },
  { id: 5, title: "Voice-First Products", description: "Development of voice-first interfaces such as travel booking, commerce and discovery. Targetting a TAM (total addressable market) based on existing markets" },
  { id: 6, title: "Product Manager First approach", description: "Emphasize becoming a strong product manager prior to building AI tool with requirements and workflows before implementing an idea. Focusing on the user rather than model being the smart individual" },
  { id: 7, title: "Lovable Integration Tool", description: "Software providing an integrated system that includes Supabase integration, authentication setups, automatic DB configs and embedded security. Making the barriers of development easier to overcome." },
  { id: 8, title: "Black Friday Agency", description: "A dedicated service focused on optimizing businesses Black Friday event plans. Including the development of marketing timeline and creation of unique bundle options, focusing on strategies that generate a full years revenue within one week." },
  { id: 9, title: "Modern Travel Guide App", description: "A tiktok inspired travel app with niche recommendations and focus on sharing vibe and energy through local hidden gems within each city for gen z or millennials. Uses Tikok api, speech to text and Zapier." },
  { id: 10, title: "Dunbar's Social Network App", description: "An anti-social network app aiming to reinforce personal connections in an ad free platform for only 150 people. Location based updates and a simplified UI makes it a private community focused on those that know eachother" },
  { id: 11, title: "Time Capsules App", description: "A physical and personalized gift which captures digital memories and consolidates a collection for experiences. Using a subscription-based system with additinal per product fee with nostalgia focused marketing approach." },
  { id: 12, title: "AI Security For AI models", description: "Cybersecurity products tailored specifically to AI companies who possess large language models (LLM's), to safeguard sensitive training data with strong emphasis of a \"Fort Knox\" structure. Based around potential theft, espionage with digital data of great worth." },
  { id: 13, title: "Moon Based Startup", description: "Space travel that focus on the moon rather than mars. Opportunities focus on: Moon tourism, mining and strategic placement with reusable launches from SpaceX. To be like a \"Varda or planet lab of the moon\"." },
  { id: 14, title: "Kid-Friendly Smart Phone", description: "A rugged limited feature smartphone geared to parents with high device control over addictive app, focuses on commucation for connectivity while giving control over kids. Positioning against Apple's sleek designs focusing on safety and safety in product." },
  { id: 15, title: "Humanoid Military Robots", description: "Develop a human like military robot for use in the army that has been adapted through artificial intelligence. Creating controversy but ultimately in alignment with inevetable new military technology" },
  { id: 16, title: "Bolt - AI powered App builder", description: "AI tool used for rapid web app prototyping, deploying the tool to a hosting website, integrating backend systems, uses plain English descriptions of functionality, offers low code integration. Intended for all levels of developers" },
  { id: 17, title: "Career AI App", description: "An AI application that assess career trajectory based on resume analysis, quizzes, job tips and recommendations geared towards helping to land dream jobs. Marketing strategies focus on students leveraging educational partnerships on linkedin and instagram." },
  { id: 18, title: "Journal AI App", description: "An AI powered Journal that allows users to analyze and develop deeper emotional support and intelligence. Enhancing general productivity while offering deep connection insights for well being and mindfulness, marketed towards individuals who currently utilise a journal and desire to explore deeper introspection." },
  { id: 19, title: "Language AI App", description: "A learning platform focused on langauge education which leverages the latest AI models to adapt dynamically compared to Duolingo which features a static model. Leveraging audio features, the focus on updating at each turn while challenging current leaders." },
  { id: 20, title: "AI UGC ads", description: "Automated ad generator utilising avatars with prewritten scripts, create viral ads which capture short form social engagement, allows for experimentation of variations. Target multiple formats with broad appeal" }
];

export const BusinessForm = ({ onSubmit, isLoading = false }: BusinessFormProps) => {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessIdea: "",
    targetRegion: "",
    industry: "",
    targetAudience: "",
    budget: "",
  });
  const [selectedPreVettedId, setSelectedPreVettedId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePreVettedSelection = (ideaId: string) => {
    const selectedIdea = preVettedIdeas.find(idea => idea.id.toString() === ideaId);
    if (selectedIdea) {
      setSelectedPreVettedId(selectedIdea.id);
      setFormData({ ...formData, businessIdea: `${selectedIdea.title}: ${selectedIdea.description}` });
    }
  };

  const handleCustomIdeaChange = (value: string) => {
    setSelectedPreVettedId(null);
    setFormData({ ...formData, businessIdea: value });
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
                <Label className="text-base font-semibold text-foreground mb-4 block">
                  Business Idea Selection *
                </Label>
                
                <Tabs defaultValue="pre-vetted" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pre-vetted" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Pre-Vetted Ideas
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2">
                      <Edit3 className="h-4 w-4" />
                      Custom Idea
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pre-vetted" className="mt-4">
                    <div className="space-y-4">
                      <Label className="text-sm text-muted-foreground">
                        Choose from our curated list of validated business concepts
                      </Label>
                      <Select onValueChange={handlePreVettedSelection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pre-vetted business idea..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          {preVettedIdeas.map((idea) => (
                            <SelectItem key={idea.id} value={idea.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{idea.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-96">
                                  {idea.description.substring(0, 100)}...
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedPreVettedId && (
                        <div className="p-4 bg-muted rounded-lg border">
                          <h4 className="font-semibold text-foreground mb-2">
                            {preVettedIdeas.find(idea => idea.id === selectedPreVettedId)?.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {preVettedIdeas.find(idea => idea.id === selectedPreVettedId)?.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom" className="mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Describe your own business idea in detail
                      </Label>
                      <Textarea
                        placeholder="Describe your business idea in detail. Include the problem you're solving, your proposed solution, and key features..."
                        className="min-h-32 resize-none"
                        value={selectedPreVettedId ? "" : formData.businessIdea}
                        onChange={(e) => handleCustomIdeaChange(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
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