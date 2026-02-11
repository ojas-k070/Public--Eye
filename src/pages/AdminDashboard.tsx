import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Complaint {
  _id: string;
  complaintId: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  zone?: string;
  createdAt: string;
  location: {
    address: string;
  };
}

const AdminPanel = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://public-eye-backend.onrender.com/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {loading && <p>Loading complaints...</p>}

      {!loading && complaints.length === 0 && (
        <p>No complaints found.</p>
      )}

      {complaints.map((complaint) => (
        <Card key={complaint._id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg">
                {complaint.title}
              </h2>
              <Badge>{complaint.status}</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              ID: {complaint.complaintId}
            </p>

            <p className="text-sm">
              📍 {complaint.location?.address}
            </p>

            {complaint.zone && (
              <p className="text-sm text-muted-foreground">
                Zone: {complaint.zone}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminPanel;
