
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestingSuite } from "@/components/testing/TestingSuite";
import { ValidationChecklist } from "@/components/testing/ValidationChecklist";
import { DatabaseConnectionTest } from "@/components/testing/DatabaseConnectionTest";
import { ResponsiveContainer } from "@/components/ui/responsive-container";

const Testing = () => {
  return (
    <ResponsiveContainer maxWidth="full" className="py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            AloraMed Testing Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive testing and validation suite for your healthcare management system
          </p>
        </div>

        <Tabs defaultValue="database" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="database">Database Health</TabsTrigger>
            <TabsTrigger value="checklist">Validation Checklist</TabsTrigger>
            <TabsTrigger value="automated">Automated Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="mt-6">
            <DatabaseConnectionTest />
          </TabsContent>
          
          <TabsContent value="checklist" className="mt-6">
            <ValidationChecklist />
          </TabsContent>
          
          <TabsContent value="automated" className="mt-6">
            <TestingSuite />
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  );
};

export default Testing;
