import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LocationCard from "@/components/LocationCard";
import VoiceRecorder from "@/components/VoiceRecorder";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  MapPin, 
  Camera, 
  Send,
  CheckCircle2,
  QrCode,
  Mic
} from "lucide-react";

const ReportIssue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    image: null as File | null,
    voiceNote: null as Blob | null
  });
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const [detectedTimestamp, setDetectedTimestamp] = useState<string>("");

  const complaintTypes = [
    { value: "garbage", label: "Garbage Collection", dept: "Sanitation Department" },
    { value: "water", label: "Water Leakage", dept: "Water Department" },
    { value: "streetlight", label: "Street Light", dept: "Electricity Department" },
    { value: "road", label: "Road Damage", dept: "Road Department" },
    { value: "other", label: "Other", dept: "General Admin" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      const complaintId = `CVC-${Date.now().toString().slice(-6)}`;
      setIsSubmitting(false);
      
      toast({
        title: "Complaint Submitted Successfully!",
        description: `Your complaint ID is ${complaintId}`,
      });
      
      navigate(`/confirmation/${complaintId}`, { 
        state: { 
          complaintData: {
            id: complaintId,
            ...formData,
            location: detectedLocation || "Location unavailable",
            timestamp: detectedTimestamp || new Date().toLocaleString(),
            status: "Pending",
            department: complaintTypes.find(t => t.value === formData.type)?.dept
          }
        }
      });
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
              <QrCode className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">QR-Triggered Reporting</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Auto-captured location and timestamp • AI-powered classification
            </p>
          </div>

          {/* Location Detection */}
          <LocationCard 
            onLocationChange={(loc, ts) => { setDetectedLocation(loc); if (ts) setDetectedTimestamp(ts); }}
          />

          {/* Report Form */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <FileText className="h-5 w-5" />
                <span>Issue Details</span>
              </CardTitle>
              <CardDescription className="text-sm">
                AI will auto-classify and route to the appropriate department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Issue Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-10"
                    required
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">Issue Category *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="AI will auto-classify from image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="garbage">🗑️ Garbage Collection</SelectItem>
                      <SelectItem value="water">💧 Water Leakage</SelectItem>
                      <SelectItem value="streetlight">💡 Street Light</SelectItem>
                      <SelectItem value="road">🛣️ Road Damage</SelectItem>
                      <SelectItem value="forest">🌳 Forest/Environment</SelectItem>
                      <SelectItem value="electricity">⚡ Electricity</SelectItem>
                      <SelectItem value="other">📋 Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.type && (
                    <p className="text-xs text-muted-foreground">
                      → {complaintTypes.find(t => t.value === formData.type)?.dept || "General Admin"}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Photo Evidence *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <div className="space-y-2">
                      <Camera className="h-6 w-6 mx-auto text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {formData.image ? formData.image.name : "Tap to capture or upload photo"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {formData.image ? "Change Photo" : "Take Photo"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Voice Recorder */}
                <VoiceRecorder 
                  onVoiceRecorded={(blob) => setFormData(prev => ({ ...prev, voiceNote: blob }))}
                />

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-gov-blue-light"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* AI Processing Notice */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">AI-Powered Department Assignment</p>
                  <p className="text-xs text-muted-foreground">
                    Your complaint will be automatically analyzed and assigned to the most appropriate department based on the type and uploaded image.
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

export default ReportIssue;