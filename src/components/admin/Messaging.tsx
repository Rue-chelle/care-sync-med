
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Phone, ExternalLink } from "lucide-react";

export const AdminMessaging = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("internal");
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchMessages();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("id, full_name, phone")
        .limit(20);

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, full_name, email")
        .limit(20);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:users!messages_sender_id_fkey(email),
          recipient:users!messages_recipient_id_fkey(email)
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
    if (!selectedRecipient || !messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      if (messageType === "whatsapp") {
        // Format WhatsApp URL
        const phone = selectedRecipient;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageContent)}`;
        window.open(whatsappUrl, "_blank");
        
        toast({
          title: "WhatsApp opened",
          description: "Continue the conversation in WhatsApp",
        });
      } else {
        // Send internal message
        const { error } = await supabase
          .from("messages")
          .insert({
            recipient_id: selectedRecipient,
            content: messageContent,
            message_type: "admin_broadcast",
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
            Admin Messaging System
          </CardTitle>
          <CardDescription>
            Send messages to patients and doctors via internal system or WhatsApp
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
              <label className="text-sm font-medium mb-2 block">
                {messageType === "whatsapp" ? "Patient Phone" : "Recipient"}
              </label>
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder={messageType === "whatsapp" ? "Select patient" : "Select recipient"} />
                </SelectTrigger>
                <SelectContent>
                  {messageType === "whatsapp" ? (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.phone || ""}>
                        {patient.full_name} {patient.phone && `(${patient.phone})`}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name} (Patient)
                        </SelectItem>
                      ))}
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.full_name} (Doctor)
                        </SelectItem>
                      ))}
                    </>
                  )}
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
          <CardDescription>Latest internal messages in the system</CardDescription>
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
                  From: {message.sender?.email || "Unknown"} → To: {message.recipient?.email || "Unknown"}
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
