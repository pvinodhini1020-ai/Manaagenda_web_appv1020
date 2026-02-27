import { useState, useEffect } from "react";
import { Send, Search, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { messageService, Message } from "@/services/messageService";
import { projectService, Project } from "@/services/projectService";
import { toast } from "sonner";
import Loader from "@/components/Loader";

export default function Messages() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let projectsData;
        if (user?.role === 'client') {
          projectsData = await projectService.getClientProjects(user.id);
        } else {
          const response = await projectService.getProjects();
          projectsData = response.data;
        }
        setProjects(projectsData || []);
        
        // Select first project by default
        if (projectsData && projectsData.length > 0) {
          setSelectedProject(projectsData[0]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedProject) return;
      
      try {
        const messagesData = await messageService.getProjectMessages(selectedProject.id);
        setMessages(messagesData || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();
  }, [selectedProject]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedProject) return;

    setSendingMessage(true);
    try {
      const messageData = await messageService.createMessage({
        content: newMessage.trim(),
        project_id: selectedProject.id
      });
      
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="md" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Communicate with your team and clients on projects</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-[calc(100vh-16rem)]">
        <div className="flex h-full">
          {/* Project list */}
          <div className="w-full md:w-80 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10 rounded-xl" />
              </div>
            </div>
            
            <div className="p-3 border-b border-border">
              <Select value={selectedProject?.id || undefined} onValueChange={(value) => {
                const project = projects.find(p => p.id === value);
                setSelectedProject(project || null);
              }}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.filter(project => project.id && project.id.trim() !== "").map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.client?.company || project.client?.name}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto">
              {projects.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No projects found
                </div>
              ) : (
                projects.filter(project => project.id && project.id.trim() !== "").map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-4 border-b border-border hover:bg-accent/50 transition-all duration-200 ${
                      selectedProject?.id === project.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.client?.company || project.client?.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Status: {project.status}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!selectedProject ? "hidden md:flex" : "flex"}`}>
            {selectedProject ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3 bg-accent/20">
                  <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{selectedProject.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedProject.client?.company || selectedProject.client?.name}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {selectedProject.status}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isMine = message.sender_id === user?.id;
                      const showDate = index === 0 || 
                        formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);
                      
                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center text-xs text-muted-foreground my-4">
                              {formatDate(message.created_at)}
                            </div>
                          )}
                          <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                              isMine ? "gradient-primary text-white" : "bg-muted text-foreground"
                            }`}>
                              {!isMine && (
                                <p className="text-xs font-medium mb-1 opacity-70">
                                  {message.sender?.name}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className={`text-xs mt-1.5 ${isMine ? "text-white/70" : "text-muted-foreground"}`}>
                                {formatTime(message.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="rounded-xl"
                      disabled={sendingMessage}
                    />
                    <Button 
                      type="submit"
                      size="icon" 
                      className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity shrink-0"
                      disabled={sendingMessage || !newMessage.trim()}
                    >
                      {sendingMessage ? (
                        <Loader size="sm" />
                      ) : (
                        <Send className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a project to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
