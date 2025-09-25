import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Clock, 
  User, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Timer
} from "lucide-react";

interface ComplaintData {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  timestamp: string;
  status: "Pending" | "In Progress" | "Resolved";
  department: string;
}

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState("");
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock complaint data
  const mockComplaints: Record<string, ComplaintData> = {
    "CVC-123456": {
      id: "CVC-123456",
      title: "Broken Street Light on Main Road",
      type: "Street Light",
      description: "The street light near the bus stop has been broken for over a week, causing safety concerns for pedestrians at night.",
      location: "New Delhi, Delhi, India",
      timestamp: "2024-01-15 14:30:22",
      status: "In Progress",
      department: "Electricity Department"
    },
    "CVC-789012": {
      id: "CVC-789012",
      title: "Garbage Not Collected",
      type: "Garbage Collection",
      description: "Garbage has not been collected from our area for the past 3 days. The bins are overflowing.",
      location: "Mumbai, Maharashtra, India",
      timestamp: "2024-01-14 09:15:30",
      status: "Resolved",
      department: "Sanitation Department"
    },
    "CVC-345678": {
      id: "CVC-345678",
      title: "Water Pipeline Leakage",
      type: "Water Leakage",
      description: "There is a major water leak on the main pipeline causing water wastage and road damage.",
      location: "Bangalore, Karnataka, India",
      timestamp: "2024-01-16 11:45:12",
      status: "Pending",
      department: "Water Department"
    }
  };

  const handleSearch = () => {
    if (!complaintId.trim()) {
      setError("Please enter a complaint ID");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const complaint = mockComplaints[complaintId.trim()];
      if (complaint) {
        setComplaintData(complaint);
        setError("");
      } else {
        setComplaintData(null);
        setError("Complaint not found. Please check your ID and try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "In Progress":
        return <Timer className="h-4 w-4 text-accent" />;
      case "Resolved":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "In Progress":
        return "bg-accent/10 text-accent border-accent/20";
      case "Resolved":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Track Your Complaint</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enter your complaint ID to view the current status and progress of your civic issue report.
            </p>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Complaint Lookup</span>
              </CardTitle>
              <CardDescription>
                Enter the complaint ID provided when you submitted your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="complaintId">Complaint ID</Label>
                  <Input
                    id="complaintId"
                    placeholder="e.g., CVC-123456"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Track Complaint
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Sample IDs for Testing */}
          <Card className="bg-muted/20">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">Sample Complaint IDs for Testing:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(mockComplaints).map(id => (
                  <Badge 
                    key={id}
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent/20"
                    onClick={() => setComplaintId(id)}
                  >
                    {id}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Complaint Details */}
          {complaintData && (
            <Card className="border-accent/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>Complaint Details</span>
                  </CardTitle>
                  <Badge className={getStatusColor(complaintData.status)}>
                    {getStatusIcon(complaintData.status)}
                    <span className="ml-1">{complaintData.status}</span>
                  </Badge>
                </div>
                <CardDescription>
                  Complaint ID: {complaintData.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title and Type */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{complaintData.title}</h3>
                  <Badge variant="secondary">{complaintData.type}</Badge>
                </div>

                <Separator />

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Location</p>
                        <p className="text-sm text-muted-foreground">{complaintData.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Submitted</p>
                        <p className="text-sm text-muted-foreground">{complaintData.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Assigned Department</p>
                        <p className="text-sm text-muted-foreground">{complaintData.department}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      {getStatusIcon(complaintData.status)}
                      <div>
                        <p className="font-medium text-sm">Current Status</p>
                        <p className="text-sm text-muted-foreground">
                          {complaintData.status === "Pending" && "Your complaint has been received and is awaiting review."}
                          {complaintData.status === "In Progress" && "Work has started on resolving your complaint."}
                          {complaintData.status === "Resolved" && "Your complaint has been successfully resolved."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <p className="font-medium text-sm mb-2">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {complaintData.description}
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3">
                  <p className="font-medium text-sm">Progress Timeline</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm">Complaint received and logged</span>
                    </div>
                    <div className={`flex items-center space-x-3 ${
                      ["In Progress", "Resolved"].includes(complaintData.status) 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }`}>
                      {["In Progress", "Resolved"].includes(complaintData.status) 
                        ? <CheckCircle2 className="h-4 w-4 text-success" />
                        : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      }
                      <span className="text-sm">Assigned to department and work started</span>
                    </div>
                    <div className={`flex items-center space-x-3 ${
                      complaintData.status === "Resolved" 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }`}>
                      {complaintData.status === "Resolved"
                        ? <CheckCircle2 className="h-4 w-4 text-success" />
                        : <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      }
                      <span className="text-sm">Issue resolved and verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;