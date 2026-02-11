import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer
} from "lucide-react";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface ComplaintData {
  complaintId: string;
  title: string;
  description: string;
  location: LocationData;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
  zone?: string;
}

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState("");
  const [complaintData, setComplaintData] = useState<ComplaintData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!complaintId.trim()) {
      setError("Please enter a complaint ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setComplaintData(null);

    try {
      const response = await fetch(
        `https://public-eye-backend.onrender.com/api/complaints/${complaintId.trim()}`
      );

      if (!response.ok) {
        throw new Error("Not found");
      }

      const data = await response.json();
      setComplaintData(data);
    } catch {
      setError("Complaint not found.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "In Progress":
        return <Timer className="h-4 w-4 text-blue-500" />;
      case "Resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Track Your Complaint</h1>
        </div>

        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle>Complaint Lookup</CardTitle>
            <CardDescription>
              Enter your Complaint ID (e.g., CVC-000001)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="CVC-000001"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Result Card */}
        {complaintData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Complaint Details</CardTitle>
                <Badge>
                  {getStatusIcon(complaintData.status)}
                  <span className="ml-1">{complaintData.status}</span>
                </Badge>
              </div>
              <CardDescription>
                Complaint ID: {complaintData.complaintId}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <h3 className="font-semibold text-lg">
                {complaintData.title}
              </h3>

              <Separator />

              {/* Location */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {complaintData.location?.address || "Location unavailable"}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(complaintData.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Zone */}
              {complaintData.zone && (
                <div className="text-sm text-muted-foreground">
                  Zone: {complaintData.zone}
                </div>
              )}

              <Separator />

              <p>{complaintData.description}</p>

            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default TrackComplaint;
