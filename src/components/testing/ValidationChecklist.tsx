
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  notes?: string;
}

export const ValidationChecklist = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Authentication & Security
    {
      id: "auth-1",
      title: "Test patient registration with email verification",
      description: "Verify new patients can register and receive email confirmation",
      priority: 'high',
      category: 'auth',
      completed: false
    },
    {
      id: "auth-2", 
      title: "Test all user role logins",
      description: "Patient, Doctor, Admin, Super Admin login flows",
      priority: 'high',
      category: 'auth',
      completed: false
    },
    {
      id: "auth-3",
      title: "Verify role-based access control",
      description: "Users can only access features for their role",
      priority: 'high',
      category: 'auth',
      completed: false
    },
    {
      id: "auth-4",
      title: "Test password reset functionality",
      description: "Users can reset passwords via email",
      priority: 'medium',
      category: 'auth',
      completed: false
    },

    // Payment & Subscription
    {
      id: "payment-1",
      title: "Test Pesepay Basic plan checkout ($29)",
      description: "Complete payment flow for Basic subscription",
      priority: 'high',
      category: 'payment',
      completed: false
    },
    {
      id: "payment-2",
      title: "Test Pesepay Premium plan checkout ($79)",
      description: "Complete payment flow for Premium subscription",
      priority: 'high',
      category: 'payment',
      completed: false
    },
    {
      id: "payment-3",
      title: "Test Pesepay Enterprise plan checkout ($199)",
      description: "Complete payment flow for Enterprise subscription",
      priority: 'high',
      category: 'payment',
      completed: false
    },
    {
      id: "payment-4",
      title: "Verify payment webhooks",
      description: "Subscription status updates after successful payment",
      priority: 'high',
      category: 'payment',
      completed: false
    },
    {
      id: "payment-5",
      title: "Test subscription cancellation",
      description: "Users can cancel their subscriptions",
      priority: 'medium',
      category: 'payment',
      completed: false
    },

    // Email Notifications
    {
      id: "email-1",
      title: "Test welcome email delivery",
      description: "New users receive welcome emails after registration",
      priority: 'high',
      category: 'email',
      completed: false
    },
    {
      id: "email-2",
      title: "Test subscription confirmation emails",
      description: "Users receive confirmation after successful payment",
      priority: 'high',
      category: 'email',
      completed: false
    },
    {
      id: "email-3",
      title: "Test appointment reminder emails",
      description: "Patients and doctors receive appointment reminders",
      priority: 'medium',
      category: 'email',
      completed: false
    },
    {
      id: "email-4",
      title: "Test password reset emails",
      description: "Users receive password reset links via email",
      priority: 'medium',
      category: 'email',
      completed: false
    },

    // Healthcare Features
    {
      id: "healthcare-1",
      title: "Test appointment booking flow",
      description: "Patients can book appointments with doctors",
      priority: 'high',
      category: 'healthcare',
      completed: false
    },
    {
      id: "healthcare-2",
      title: "Test appointment management",
      description: "Doctors can view, update, and manage appointments",
      priority: 'high',
      category: 'healthcare',
      completed: false
    },
    {
      id: "healthcare-3",
      title: "Test patient record management",
      description: "Doctors can create and update patient records",
      priority: 'high',
      category: 'healthcare',
      completed: false
    },
    {
      id: "healthcare-4",
      title: "Test prescription management",
      description: "Doctors can create and manage prescriptions",
      priority: 'medium',
      category: 'healthcare',
      completed: false
    },

    // User Experience
    {
      id: "ux-1",
      title: "Test mobile responsiveness",
      description: "All pages work correctly on mobile devices",
      priority: 'high',
      category: 'ux',
      completed: false
    },
    {
      id: "ux-2",
      title: "Test navigation and user flows",
      description: "Users can easily navigate through the application",
      priority: 'medium',
      category: 'ux',
      completed: false
    },
    {
      id: "ux-3",
      title: "Test error handling",
      description: "Graceful error messages and fallbacks",
      priority: 'medium',
      category: 'ux',
      completed: false
    },

    // Performance
    {
      id: "performance-1",
      title: "Test page load times",
      description: "All pages load within 3 seconds",
      priority: 'medium',
      category: 'performance',
      completed: false
    },
    {
      id: "performance-2",
      title: "Test with multiple users",
      description: "System handles concurrent user sessions",
      priority: 'low',
      category: 'performance',
      completed: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Items', count: checklist.length },
    { id: 'auth', name: 'Authentication', count: checklist.filter(item => item.category === 'auth').length },
    { id: 'payment', name: 'Payment', count: checklist.filter(item => item.category === 'payment').length },
    { id: 'email', name: 'Email', count: checklist.filter(item => item.category === 'email').length },
    { id: 'healthcare', name: 'Healthcare', count: checklist.filter(item => item.category === 'healthcare').length },
    { id: 'ux', name: 'User Experience', count: checklist.filter(item => item.category === 'ux').length },
    { id: 'performance', name: 'Performance', count: checklist.filter(item => item.category === 'performance').length }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getPriorityBadge = (priority: ChecklistItem['priority']) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-green-100 text-green-800"
    };
    
    return <Badge className={styles[priority]}>{priority}</Badge>;
  };

  const filteredItems = activeCategory === 'all' 
    ? checklist 
    : checklist.filter(item => item.category === activeCategory);

  const completedCount = filteredItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / filteredItems.length) * 100;

  const highPriorityIncomplete = checklist.filter(item => 
    item.priority === 'high' && !item.completed
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            MVP Validation Checklist
          </CardTitle>
          <CardDescription>
            Track your testing progress and ensure all critical features are validated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{filteredItems.length - completedCount}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{highPriorityIncomplete}</div>
              <div className="text-sm text-gray-600">High Priority Left</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {highPriorityIncomplete > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {highPriorityIncomplete} high-priority items need attention before MVP launch
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
              <Badge variant="outline" className="ml-1">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className={`transition-all ${item.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleItem(item.id)}
                        className="mt-1"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.title}
                          </h3>
                          {getPriorityBadge(item.priority)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={item.completed}
                              onCheckedChange={() => toggleItem(item.id)}
                            />
                            <span className="text-xs text-gray-500">
                              Mark as {item.completed ? 'incomplete' : 'complete'}
                            </span>
                          </div>
                          
                          {item.completed && (
                            <Badge className="bg-green-100 text-green-800">
                              ✓ Validated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Ready for Launch?</h3>
              <p className="text-sm text-gray-600">
                Complete all high-priority items to ensure MVP readiness
              </p>
            </div>
            <Button 
              className={highPriorityIncomplete === 0 ? "healthcare-gradient text-white" : ""}
              variant={highPriorityIncomplete === 0 ? "default" : "outline"}
              disabled={highPriorityIncomplete > 0}
            >
              {highPriorityIncomplete === 0 ? "🚀 MVP Ready!" : `${highPriorityIncomplete} items left`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
