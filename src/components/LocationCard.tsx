import { MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationCardProps {
  location?: string;
  timestamp?: string;
  className?: string;
}

const LocationCard = ({ 
  location = "Auto-detecting location...", 
  timestamp,
  className = "" 
}: LocationCardProps) => {
  return (
    <Card className={`border-accent/20 bg-gradient-to-r from-accent/5 to-secondary/5 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <MapPin className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Location</p>
              <p className="text-sm text-muted-foreground">{location}</p>
              {timestamp && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{timestamp}</span>
                </div>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="bg-success/10 text-success">
            GPS Active
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;