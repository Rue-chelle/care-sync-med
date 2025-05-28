
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, ExternalLink, Mail, Phone } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface MessagingInterfaceProps {
  userType: 'doctor' | 'admin' | 'patient';
  targetUserType?: 'doctor' | 'patient' | 'admin';
}

export const MessagingInterface = ({ userType, targetUserType }: MessagingInterfaceProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("internal");
  const [subject, setSubject] = useState("");
  const { toast } = useToast();
  const { user } = useUserStore();

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    try {
      let query = supabase.from("users").select("id, email, full_name, role");
      
      if (targetUserType) {
        query = query.eq("role", targetUserType);
      } else {
        query = query.neq("id", user?.id);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:users!messages_sender_id_fkey(email, full_name),
          recipient:users!messages_recipient_id_fkey(email, full_name)
        `)
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedUser || !messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please select a user and enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      if (messageType === "whatsapp") {
        const selectedUserData = users.find(u => u.id === selectedUser);
        const phone = selectedUserData?.phone || "1234567890"; // Fallback for demo
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageContent)}`;
        window.open(whatsappUrl, "_blank");
        
        toast({
          title: "WhatsApp opened",
          description: "Continue the conversation in WhatsApp",
        });
      } else if (messageType === "email") {
        const selectedUserData = users.find(u => u.id === selectedUser);
        const emailUrl = `mailto:${selectedUserData?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageContent)}`;
        window.open(emailUrl, "_blank");
        
        toast({
          title: "Email client opened",
          description: "Continue composing in your email client",
        });
      } else {
        const { error } = await supabase
          .from("messages")
          .insert({
            sender_id: user?.id,
            recipient_id: selectedUser,
            content: messageContent,
            message_type: `${userType}_message`,
            subject: subject || "Message"
          });

        if (error) throw error;

        toast({
          title: "Message sent",
          description: "Your message has been sent successfully",
        });

        setMessageContent("");
        setSubject("");
        fetchMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Message
          </CardTitle>
          <CardDescription>
            Send messages via internal system, WhatsApp, or email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Message Type</label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Message</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Recipient</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(messageType === "email" || messageType === "internal") && (
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Message subject"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
            />
          </div>

          <Button onClick={sendMessage} className="w-full">
            {messageType === "whatsapp" ? (
              <>
                <Phone className="h-4 w-4 mr-2" />
                Open WhatsApp
              </>
            ) : messageType === "email" ? (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Open Email
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Your recent conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">
                    {message.message_type || "General"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{message.subject}</h4>
                <p className="text-sm mb-2">{message.content}</p>
                <div className="text-xs text-muted-foreground">
                  From: {message.sender?.full_name || message.sender?.email || "Unknown"} → 
                  To: {message.recipient?.full_name || message.recipient?.email || "Unknown"}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No messages found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
