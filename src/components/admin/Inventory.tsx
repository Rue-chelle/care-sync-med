
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Edit, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  price: number;
  supplier: string;
  lastUpdated: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

export const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    minQuantity: 0,
    unit: "",
    price: 0,
    supplier: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    // Initialize with sample data
    const sampleItems: InventoryItem[] = [
      {
        id: "1",
        name: "Paracetamol 500mg",
        category: "Medication",
        quantity: 150,
        minQuantity: 50,
        unit: "tablets",
        price: 0.50,
        supplier: "PharmaCorp",
        lastUpdated: new Date().toISOString(),
        status: "in_stock"
      },
      {
        id: "2",
        name: "Disposable Syringes",
        category: "Medical Supplies",
        quantity: 25,
        minQuantity: 100,
        unit: "pieces",
        price: 0.75,
        supplier: "MedSupply Inc",
        lastUpdated: new Date().toISOString(),
        status: "low_stock"
      },
      {
        id: "3",
        name: "Bandages",
        category: "Medical Supplies",
        quantity: 0,
        minQuantity: 20,
        unit: "rolls",
        price: 2.50,
        supplier: "HealthCare Ltd",
        lastUpdated: new Date().toISOString(),
        status: "out_of_stock"
      },
      {
        id: "4",
        name: "Digital Thermometer",
        category: "Equipment",
        quantity: 8,
        minQuantity: 5,
        unit: "pieces",
        price: 25.00,
        supplier: "TechMed",
        lastUpdated: new Date().toISOString(),
        status: "in_stock"
      }
    ];
    setItems(sampleItems);
  }, []);

  const getItemStatus = (quantity: number, minQuantity: number): "in_stock" | "low_stock" | "out_of_stock" => {
    if (quantity === 0) return "out_of_stock";
    if (quantity <= minQuantity) return "low_stock";
    return "in_stock";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const status = getItemStatus(formData.quantity, formData.minQuantity);
    
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, status, lastUpdated: new Date().toISOString() }
          : item
      ));
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } else {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData,
        status,
        lastUpdated: new Date().toISOString()
      };
      setItems([...items, newItem]);
      toast({
        title: "Success",
        description: "Item added successfully",
      });
    }

    setFormData({
      name: "",
      category: "",
      quantity: 0,
      minQuantity: 0,
      unit: "",
      price: 0,
      supplier: ""
    });
    setEditingItem(null);
    setIsAddDialogOpen(false);
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      unit: item.unit,
      price: item.price,
      supplier: item.supplier
    });
    setIsAddDialogOpen(true);
  };

  const startAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "",
      quantity: 0,
      minQuantity: 0,
      unit: "",
      price: 0,
      supplier: ""
    });
    setIsAddDialogOpen(true);
  };

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const stats = {
    total: items.length,
    inStock: items.filter(i => i.status === "in_stock").length,
    lowStock: items.filter(i => i.status === "low_stock").length,
    outOfStock: items.filter(i => i.status === "out_of_stock").length,
    totalValue: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              Total Items
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600">{stats.inStock}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              In Stock
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-yellow-600">{stats.lowStock}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Low Stock
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-red-600">{stats.outOfStock}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              Out of Stock
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</CardTitle>
            <CardDescription>Total Value</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
              <CardDescription>
                Track and manage medical supplies and equipment
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={startAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? "Edit Item" : "Add New Item"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingItem ? "Update item information" : "Add a new inventory item"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Medication">Medication</SelectItem>
                            <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Consumables">Consumables</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minQuantity">Min Quantity</Label>
                        <Input
                          id="minQuantity"
                          type="number"
                          value={formData.minQuantity}
                          onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          placeholder="e.g., tablets, pieces, ml"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price per Unit</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        required
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
                        {editingItem ? "Update" : "Add"} Item
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                    {item.quantity <= item.minQuantity && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 inline ml-1" />
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No items found matching the current filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
