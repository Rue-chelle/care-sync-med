
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, Edit, MapPin, Phone, Mail, Users } from "lucide-react";

export const BranchManagement = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    is_active: true
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch branches",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBranch) {
        const { error } = await supabase
          .from("clinics")
          .update(formData)
          .eq("id", editingBranch.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Branch updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("clinics")
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Branch created successfully",
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        is_active: true
      });
      setEditingBranch(null);
      setIsAddDialogOpen(false);
      fetchBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      toast({
        title: "Error",
        description: "Failed to save branch",
        variant: "destructive",
      });
    }
  };

  const startEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      email: branch.email,
      phone: branch.phone || "",
      address: branch.address || "",
      is_active: branch.is_active
    });
    setIsAddDialogOpen(true);
  };

  const startAdd = () => {
    setEditingBranch(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      is_active: true
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Branch Management
              </CardTitle>
              <CardDescription>
                Manage clinic branches and locations
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={startAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingBranch ? "Edit Branch" : "Add New Branch"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBranch ? "Update branch information" : "Create a new clinic branch"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Branch Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingBranch ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {branch.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {branch.email}
                      </div>
                      {branch.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {branch.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {branch.address || "No address"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.is_active ? "default" : "secondary"}>
                      {branch.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">
                        {branch.subscription_plan || "Basic"}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {branch.subscription_status || "Trial"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(branch)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No branches found. Add your first branch to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{branches.length}</CardTitle>
            <CardDescription>Total Branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600">
              {branches.filter(b => b.is_active).length} Active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {branches.filter(b => b.subscription_status === 'active').length}
            </CardTitle>
            <CardDescription>Active Subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-600">
              Paid subscriptions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">
              {branches.filter(b => b.subscription_status === 'trial').length}
            </CardTitle>
            <CardDescription>Trial Branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-orange-600">
              In trial period
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
