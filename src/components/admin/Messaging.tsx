import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, ExternalLink } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export const AdminMessaging = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("internal");
  const { toast } = useToast();
  const { user } = useUserStore();

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, full_name, role")
        .neq("role", "admin")
        .limit(50);

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
        if (selectedUserData?.phone) {
          const whatsappUrl = `https://wa.me/${selectedUserData.phone}?text=${encodeURIComponent(messageContent)}`;
          window.open(whatsappUrl, "_blank");
          
          toast({
            title: "WhatsApp opened",
            description: "Continue the conversation in WhatsApp",
          });
        } else {
          toast({
            title: "Error",
            description: "User phone number not available",
            variant: "destructive",
          });
        }
      } else {
        const { error } = await supabase
          .from("messages")
          .insert({
            sender_id: user?.id,
            recipient_id: selectedUser,
            content: messageContent,
            message_type: "admin_message",
            subject: "Admin Message"
          });

        if (error) throw error;

        toast({
          title: "Message sent",
          description: "Your message has been sent successfully",
        });

        setMessageContent("");
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
            User Communication
          </CardTitle>
          <CardDescription>
            Send messages to doctors and patients via internal system or WhatsApp
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
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
                <ExternalLink className="h-4 w-4 mr-2" />
                Open WhatsApp
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
          <CardDescription>Recent conversations in the system</CardDescription>
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
