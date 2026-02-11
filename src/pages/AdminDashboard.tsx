import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  MapPin, 
  Users, 
  FileText, 
  Filter, 
  Download,
  Settings,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

const AdminDashboard = () => {
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsComplaintId, setDetailsComplaintId] = useState<string | null>(null);
  const [statusModalComplaintId, setStatusModalComplaintId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<"Pending" | "In Progress" | "Resolved">("Pending");
  const [priorityDraft, setPriorityDraft] = useState<"High" | "Medium" | "Low">("Medium");

  // Mock data
  const stats = [
    { title: "Total Complaints", value: "12,847", change: "+8%", icon: FileText, color: "text-primary" },
    { title: "Pending Review", value: "892", change: "-5%", icon: Clock, color: "text-warning" },
    { title: "In Progress", value: "2,145", change: "+12%", icon: TrendingUp, color: "text-accent" },
    { title: "Resolved", value: "9,810", change: "+15%", icon: CheckCircle2, color: "text-success" }
  ];

  const initialComplaints = [
    {
      id: "CVC-123456",
      title: "Broken Street Light on Main Road",
      type: "Street Light",
      city: "New Delhi",
      department: "Electricity Department",
      status: "In Progress",
      date: "2024-01-15",
      priority: "High"
    },
    {
      id: "CVC-789012",
      title: "Garbage Not Collected",
      type: "Garbage Collection",
      city: "Mumbai",
      department: "Sanitation Department",
      status: "Resolved",
      date: "2024-01-14",
      priority: "Medium"
    },
    {
      id: "CVC-345678",
      title: "Water Pipeline Leakage",
      type: "Water Leakage",
      city: "Bangalore",
      department: "Water Department",
      status: "Pending",
      date: "2024-01-16",
      priority: "High"
    },
    {
      id: "CVC-456789",
      title: "Pothole on Highway",
      type: "Road Damage",
      city: "Chennai",
      department: "Road Department",
      status: "In Progress",
      date: "2024-01-13",
      priority: "Medium"
    }
  ];

  const [complaints, setComplaints] = useState(initialComplaints);

  const cityData = [
    { city: "New Delhi", total: 3456, pending: 234, inProgress: 567, resolved: 2655, level: "High" },
    { city: "Mumbai", total: 2890, pending: 189, inProgress: 445, resolved: 2256, level: "High" },
    { city: "Bangalore", total: 2234, pending: 156, inProgress: 334, resolved: 1744, level: "Moderate" },
    { city: "Chennai", total: 1876, pending: 123, inProgress: 289, resolved: 1464, level: "Moderate" },
    { city: "Kolkata", total: 1567, pending: 98, inProgress: 234, resolved: 1235, level: "Low" },
    { city: "Pune", total: 823, pending: 67, inProgress: 123, resolved: 633, level: "Low" }
  ];

  // Approximate positions on India map for density overlay (percent of width/height)
  const cityPositions: Record<string, { x: number; y: number }> = {
    "New Delhi": { x: 48, y: 23 },
    "Mumbai": { x: 33, y: 62 },
    "Bangalore": { x: 45, y: 75 },
    "Chennai": { x: 56, y: 77 },
    "Kolkata": { x: 73, y: 42 },
    "Pune": { x: 36, y: 65 },
  };

  const maxTotal = useMemo(() => Math.max(...cityData.map(c => c.total)), [cityData]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-destructive";
      case "Moderate":
        return "text-warning";
      case "Low":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  // Heatmap image state and controls
  const [heatmapImageUrl, setHeatmapImageUrl] = useState<string>("");
  const [heatmapUrlInput, setHeatmapUrlInput] = useState<string>("");
  const [heatmapZoom, setHeatmapZoom] = useState<number>(1);
  const applyHeatmapUrl = () => setHeatmapImageUrl(heatmapUrlInput.trim());
  const onHeatmapFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setHeatmapImageUrl(objectUrl);
  };
  const zoomIn = () => setHeatmapZoom((z) => Math.min(3, z + 0.25));
  const zoomOut = () => setHeatmapZoom((z) => Math.max(0.5, z - 0.25));
  const zoomReset = () => setHeatmapZoom(1);

  const filteredComplaints = useMemo(() => {
    const cityMap: Record<string, string> = {
      delhi: "New Delhi",
      mumbai: "Mumbai",
      bangalore: "Bangalore",
      chennai: "Chennai"
    };
    return complaints.filter((c) => {
      const cityOk = selectedCity === "all" || c.city === cityMap[selectedCity];
      const deptOk = selectedDepartment === "all" || c.department.toLowerCase().includes(selectedDepartment);
      const statusMap: Record<string, string> = { pending: "Pending", progress: "In Progress", resolved: "Resolved" };
      const statusOk = selectedStatus === "all" || c.status === statusMap[selectedStatus];
      const q = searchQuery.trim().toLowerCase();
      const searchOk = q.length === 0 ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q);
      return cityOk && deptOk && statusOk && searchOk;
    });
  }, [complaints, selectedCity, selectedDepartment, selectedStatus, searchQuery]);

  const handleExportCsv = () => {
    const headers = ["ID","Title","Type","City","Department","Status","Date","Priority"];
    const rows = filteredComplaints.map(c => [c.id, c.title, c.type, c.city, c.department, c.status, c.date, c.priority]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complaints_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const openStatusModal = (id: string, currentStatus: "Pending" | "In Progress" | "Resolved", currentPriority: "High" | "Medium" | "Low") => {
    setStatusModalComplaintId(id);
    setStatusDraft(currentStatus);
    setPriorityDraft(currentPriority);
  };

  const applyStatusUpdate = () => {
    if (!statusModalComplaintId) return;
    setComplaints(prev => prev.map(c => c.id === statusModalComplaintId ? { ...c, status: statusDraft, priority: priorityDraft } : c));
    setStatusModalComplaintId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage and monitor civic complaints across all cities</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportCsv}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" onClick={() => alert('Settings coming soon') }>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className={stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}>
                          {stat.change}
                        </span> from last month
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="complaints" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="complaints">Complaints Management</TabsTrigger>
              <TabsTrigger value="analytics">City Analytics</TabsTrigger>
              <TabsTrigger value="heatmap">Complaint Heatmap</TabsTrigger>
            </TabsList>

            {/* Complaints Management */}
            <TabsContent value="complaints" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          <SelectItem value="delhi">New Delhi</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="chennai">Chennai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="sanitation">Sanitation</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="road">Road</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search complaints..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Complaints Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>Latest complaints submitted across all cities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredComplaints.map((complaint) => (
                      <div key={complaint.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{complaint.title}</h4>
                            <p className="text-sm text-muted-foreground">ID: {complaint.id}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{complaint.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">City:</span>
                            <p className="font-medium">{complaint.city}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Department:</span>
                            <p className="font-medium">{complaint.department}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium">{complaint.date}</p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setDetailsComplaintId(complaint.id)}>View Details</Button>
                          <Button size="sm" onClick={() => openStatusModal(
                            complaint.id,
                            complaint.status as "Pending" | "In Progress" | "Resolved",
                            complaint.priority as "High" | "Medium" | "Low"
                          )}>Update Status</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* City Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>City-wise Complaint Analysis</span>
                  </CardTitle>
                  <CardDescription>Complaint statistics across major cities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cityData.map((city, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{city.city}</h4>
                              <p className="text-sm text-muted-foreground">Total: {city.total} complaints</p>
                            </div>
                          </div>
                          <Badge className={`${getLevelColor(city.level)}`} variant="outline">
                            {city.level} Activity
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-2 bg-warning/10 rounded">
                            <p className="font-medium text-warning">{city.pending}</p>
                            <p className="text-muted-foreground">Pending</p>
                          </div>
                          <div className="text-center p-2 bg-accent/10 rounded">
                            <p className="font-medium text-accent">{city.inProgress}</p>
                            <p className="text-muted-foreground">In Progress</p>
                          </div>
                          <div className="text-center p-2 bg-success/10 rounded">
                            <p className="font-medium text-success">{city.resolved}</p>
                            <p className="text-muted-foreground">Resolved</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Heatmap */}
            <TabsContent value="heatmap" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Complaint Density Heatmap</span>
                  </CardTitle>
                  <CardDescription>India map with complaint density overlay. You can also show a custom heatmap image.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* India Map Density Overlay */}
                    <div className="w-full bg-muted/20 rounded-lg border p-3">
                      <div className="relative mx-auto max-w-3xl">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag-map_of_India.svg"
                          alt="India Map"
                          className="w-full h-auto opacity-90 select-none"
                          draggable={false}
                        />
                        {cityData.map((c, idx) => {
                          const pos = cityPositions[c.city];
                          if (!pos) return null;
                          const intensity = Math.max(0.2, c.total / maxTotal); // 0.2..1 scale
                          // Color from green -> red by intensity
                          const red = Math.floor(255 * intensity);
                          const green = Math.floor(180 * (1 - intensity));
                          const bg = `rgba(${red}, ${green}, 64, 0.65)`;
                          return (
                            <div
                              key={idx}
                              className="absolute rounded-full border border-border/50"
                              style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                width: `${14 + 18 * intensity}px`,
                                height: `${14 + 18 * intensity}px`,
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: bg,
                                boxShadow: `0 0 ${8 + 10 * intensity}px ${bg}`,
                              }}
                              title={`${c.city}: ${c.total} complaints`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-center text-xs text-muted-foreground mt-2">Relative density circles by city (size and color ~ total complaints)</p>
                    </div>
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <Input placeholder="Paste heatmap image URL" value={heatmapUrlInput} onChange={(e) => setHeatmapUrlInput(e.target.value)} />
                        <Button variant="outline" onClick={applyHeatmapUrl}>Apply</Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="heatmapFile" type="file" accept="image/*" className="hidden" onChange={onHeatmapFile} />
                        <Button variant="outline" onClick={() => document.getElementById('heatmapFile')?.click()}>Upload Image</Button>
                        <Button variant="outline" onClick={zoomOut}>-</Button>
                        <Button variant="outline" onClick={zoomReset}>100%</Button>
                        <Button variant="outline" onClick={zoomIn}>+</Button>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-success rounded"></div>
                        <span className="text-sm">Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-warning rounded"></div>
                        <span className="text-sm">Moderate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-destructive rounded"></div>
                        <span className="text-sm">High</span>
                      </div>
                    </div>
                    
                    {/* Optional custom heatmap image (hidden unless provided) */}
                    {heatmapImageUrl ? (
                      <div className="w-full bg-muted/20 rounded-lg border overflow-hidden">
                        <div className="w-full h-[420px] md:h-[520px] overflow-auto">
                          <img
                            src={heatmapImageUrl}
                            alt="Complaint Density Heatmap"
                            className="block mx-auto select-none"
                            style={{ transform: `scale(${heatmapZoom})`, transformOrigin: 'center center' }}
                            draggable={false}
                          />
                        </div>
                      </div>
                    ) : null}

                    {heatmapImageUrl && (
                      <p className="text-center text-sm text-muted-foreground">
                        Zoom with the controls above. Upload or paste a different image URL to replace.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Global Modals */}
          {/* Details Modal */}
          {detailsComplaintId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-background rounded-lg shadow-lg w-full max-w-lg border p-6">
                <h3 className="text-lg font-semibold mb-2">Complaint Details</h3>
                <p className="text-sm text-muted-foreground mb-4">ID: {detailsComplaintId}</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDetailsComplaintId(null)}>Close</Button>
                </div>
              </div>
            </div>
          )}

          {/* Update Status Modal */}
          {statusModalComplaintId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-background rounded-lg shadow-lg w-full max-w-md border">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Update Complaint</h3>
                  <p className="text-sm text-muted-foreground">ID: {statusModalComplaintId}</p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusDraft} onValueChange={(v) => setStatusDraft(v as "Pending" | "In Progress" | "Resolved")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={priorityDraft} onValueChange={(v) => setPriorityDraft(v as "High" | "Medium" | "Low")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setStatusModalComplaintId(null)}>Cancel</Button>
                  <Button onClick={applyStatusUpdate}>Update</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;