
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, UserPlus, Send, Phone, Video, MoreHorizontal } from "lucide-react";

export const AdminMessaging = () => {
  const [activeTab, setActiveTab] = useState("internal");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fetch doctors, patients and admins as contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      // Fetch doctors
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('id, full_name, email, specialization')
        .limit(10);
      
      if (doctorsError) throw doctorsError;
      
      // Fetch patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, full_name, email')
        .limit(10);
      
      if (patientsError) throw patientsError;
      
      // Combine and format
      const formattedContacts = [
        ...doctors.map(doctor => ({
          id: doctor.id,
          name: doctor.full_name,
          email: doctor.email,
          role: 'Doctor',
          specialty: doctor.specialization,
          lastSeen: 'Online',
          hasUnread: Math.random() > 0.7,
        })),
        ...patients.map(patient => ({
          id: patient.id,
          name: patient.full_name || 'Patient',
          email: patient.email,
          role: 'Patient',
          lastSeen: '2 hours ago',
          hasUnread: Math.random() > 0.7,
        }))
      ];
      
      // Add some mock whatsapp contacts for the external tab
      const externalContacts = [
        { id: 'ext1', name: 'Dr. Williams', phone: '+1234567890', role: 'Doctor', platform: 'WhatsApp' },
        { id: 'ext2', name: 'Sarah Patient', phone: '+1987654321', role: 'Patient', platform: 'WhatsApp' },
        { id: 'ext3', name: 'Clinic Reception', phone: '+1122334455', role: 'Staff', platform: 'WhatsApp' }
      ];
      
      setContacts(activeTab === 'internal' ? formattedContacts : externalContacts);
      
      if (formattedContacts.length > 0) {
        setSelectedChat(formattedContacts[0]);
        fetchMessages(formattedContacts[0].id);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error loading contacts",
        description: "Could not load your contacts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (contactId: string) => {
    // For now we'll use mock data
    const mockMessages = [
      {
        id: 1,
        sender: 'admin',
        content: 'Hello, how can I help you today?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        sender: 'contact',
        content: 'I need help with scheduling a new appointment',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 3,
        sender: 'admin',
        content: 'Of course, I can help with that. Which doctor would you like to see?',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: 4,
        sender: 'contact',
        content: 'I was hoping to see Dr. Smith next Tuesday afternoon if possible.',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        id: 5,
        sender: 'admin',
        content: 'Let me check the availability for Dr. Smith on Tuesday.',
        timestamp: new Date(Date.now() - 3200000).toISOString(),
      }
    ];
    
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    // Add message to UI immediately
    const newMsg = {
      id: Date.now(),
      sender: 'admin',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // In production, you would save to database here
    toast({
      title: "Message sent",
      description: activeTab === 'external' ? "Message sent via WhatsApp" : "Message sent",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Refresh contacts based on tab
    setContacts([]);
    setSelectedChat(null);
    setTimeout(() => fetchContacts(), 100);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Messaging System</CardTitle>
        <Tabs value={activeTab} onValueChange={handleTabChange} defaultValue="internal" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="internal">Internal Messages</TabsTrigger>
            <TabsTrigger value="external">WhatsApp</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="flex h-[calc(70vh-2rem)] border-t">
          {/* Contacts Sidebar */}
          <div className="w-1/3 border-r">
            <div className="p-3 border-b">
              <Input 
                placeholder={activeTab === 'internal' ? "Search users..." : "Search contacts..."}
                className="w-full"
              />
            </div>
            <ScrollArea className="h-[calc(70vh-6rem)]">
              <div className="space-y-1 p-2">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedChat(contact);
                      fetchMessages(contact.id);
                    }}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-slate-100 ${
                      selectedChat?.id === contact.id ? "bg-slate-100" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {contact.name?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{contact.name}</p>
                        <span className="text-xs text-gray-500">
                          {contact.lastSeen}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {activeTab === 'internal' ? contact.role : contact.platform}
                        </p>
                        {contact.hasUnread && (
                          <Badge className="bg-blue-500 text-white">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedChat.name?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedChat.name}</p>
                      <p className="text-sm text-gray-500">
                        {activeTab === 'internal' 
                          ? `${selectedChat.role}${selectedChat.specialty ? ` • ${selectedChat.specialty}` : ''}` 
                          : selectedChat.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'admin' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'admin'
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t flex space-x-2">
                  <Input
                    placeholder={
                      activeTab === 'external'
                        ? `Type WhatsApp message to ${selectedChat.name}...`
                        : `Type a message...`
                    }
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="healthcare-gradient text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
