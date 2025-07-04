
import { ProductionDashboard } from "@/components/admin/ProductionDashboard";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const ProductionStatus = () => {
  return (
    <ResponsiveContainer maxWidth="full" className="py-8">
      <ProductionDashboard />
    </ResponsiveContainer>
  );
};

export default ProductionStatus;
