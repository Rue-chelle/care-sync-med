
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Flag, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  is_enabled: boolean;
  clinic_specific: boolean;
  affectedClinics: number;
}

export const FeatureFlags = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureFlag | null>(null);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    is_enabled: false,
    clinic_specific: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*');

      if (error) throw error;

      // Fetch affected clinics count for each clinic-specific feature
      const enhancedFeatures = await Promise.all(data.map(async (feature) => {
        let affectedClinics = 0;
        if (feature.clinic_specific) {
          const { count } = await supabase
            .from('clinic_feature_flags')
            .select('id', { count: 'exact' })
            .eq('feature_flag_id', feature.id);
          affectedClinics = count || 0;
        }
        return { ...feature, affectedClinics };
      }));

      setFeatures(enhancedFeatures);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      toast({
        title: "Error",
        description: "Failed to fetch feature flags",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeature = async (id: string) => {
    try {
      const feature = features.find(f => f.id === id);
      if (!feature) return;

      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled: !feature.is_enabled })
        .eq('id', id);

      if (error) throw error;

      setFeatures(features.map(feature => 
        feature.id === id 
          ? { ...feature, is_enabled: !feature.is_enabled }
          : feature
      ));

      toast({
        title: "Success",
        description: `Feature ${feature.name} ${!feature.is_enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature status",
        variant: "destructive",
      });
    }
  };

  const handleAddFeature = async () => {
    try {
      if (!newFeature.name) {
        toast({
          title: "Error",
          description: "Feature name is required",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('feature_flags')
        .insert({
          name: newFeature.name,
          description: newFeature.description,
          is_enabled: newFeature.is_enabled,
          clinic_specific: newFeature.clinic_specific
        })
        .select();

      if (error) throw error;

      setFeatures([...features, { ...data[0], affectedClinics: 0 }]);
      setIsAddDialogOpen(false);
      setNewFeature({
        name: "",
        description: "",
        is_enabled: false,
        clinic_specific: false
      });

      toast({
        title: "Success",
        description: "Feature flag created successfully",
      });
    } catch (error) {
      console.error('Error adding feature flag:', error);
      toast({
        title: "Error",
        description: "Failed to create feature flag",
        variant: "destructive",
      });
    }
  };

  const openConfigDialog = (feature: FeatureFlag) => {
    setSelectedFeature(feature);
    setIsConfigDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Feature Flags</h2>
          <p className="text-purple-300">Control feature rollouts and A/B testing</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature Flag
        </Button>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flag className="h-5 w-5 mr-2 text-purple-400" />
            Feature Flags ({features.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-white/70 py-8">Loading feature flags...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30">
                  <TableHead className="text-purple-300">Feature</TableHead>
                  <TableHead className="text-purple-300">Type</TableHead>
                  <TableHead className="text-purple-300">Status</TableHead>
                  <TableHead className="text-purple-300">Affected Clinics</TableHead>
                  <TableHead className="text-purple-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => (
                  <TableRow key={feature.id} className="border-purple-500/20">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{feature.name}</div>
                        <div className="text-sm text-purple-300">{feature.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={feature.clinic_specific ? "text-yellow-400 border-yellow-500/30" : "text-blue-400 border-blue-500/30"}>
                        {feature.clinic_specific ? "Clinic-specific" : "Global"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={feature.is_enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                        <Badge className={feature.is_enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {feature.is_enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-purple-300">
                      {feature.clinic_specific ? `${feature.affectedClinics} clinics` : "All clinics"}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-purple-500/30 text-purple-300"
                        onClick={() => openConfigDialog(feature)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Feature Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#1a1a2e] text-white border border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Feature Flag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Feature Name</Label>
              <Input 
                id="name" 
                value={newFeature.name} 
                onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                className="bg-[#252543] border-purple-500/30 text-white"
                placeholder="e.g., advanced_analytics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea 
                id="description" 
                value={newFeature.description}
                onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                className="bg-[#252543] border-purple-500/30 text-white"
                placeholder="Describe what this feature does"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="enabled" 
                checked={newFeature.is_enabled}
                onCheckedChange={(checked) => setNewFeature({...newFeature, is_enabled: !!checked})}
              />
              <Label htmlFor="enabled" className="text-white">Enable feature by default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="clinic_specific" 
                checked={newFeature.clinic_specific}
                onCheckedChange={(checked) => setNewFeature({...newFeature, clinic_specific: !!checked})}
              />
              <Label htmlFor="clinic_specific" className="text-white">Clinic-specific feature</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="border-purple-500/30 text-purple-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddFeature}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Add Feature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Feature Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="bg-[#1a1a2e] text-white border border-purple-500/30 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Configure Feature: {selectedFeature?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Feature Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedFeature?.is_enabled}
                  onCheckedChange={() => {
                    if (selectedFeature) toggleFeature(selectedFeature.id);
                  }}
                />
                <span className="text-white">
                  {selectedFeature?.is_enabled ? "Enabled" : "Disabled"} globally
                </span>
              </div>
            </div>

            {selectedFeature?.clinic_specific && (
              <div className="space-y-2">
                <Label className="text-white">Clinic Configuration</Label>
                <Card className="bg-[#252543] border-purple-500/30">
                  <CardContent className="py-4">
                    <p className="text-purple-300">
                      This feature is enabled for {selectedFeature.affectedClinics} clinics.
                    </p>
                    <Button 
                      className="mt-4 bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                    >
                      Manage Clinic Access
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setIsConfigDialogOpen(false)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
