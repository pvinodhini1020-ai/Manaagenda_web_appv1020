import { useState } from "react";
import { Send, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const conversations = [
  { id: 1, name: "Priya Nair", role: "Client", lastMessage: "When will the project be ready?", time: "2m ago", unread: 2 },
  { id: 2, name: "Ravi Sharma", role: "Employee", lastMessage: "I've completed the API integration", time: "1h ago", unread: 0 },
  { id: 3, name: "Anil Mehta", role: "Client", lastMessage: "Please share the proposal", time: "3h ago", unread: 1 },
  { id: 4, name: "Ananya Verma", role: "Employee", lastMessage: "Design mockups are ready", time: "1d ago", unread: 0 },
];

const messages = [
  { id: 1, sender: "Priya Nair", text: "Hi, I wanted to check on the project progress.", time: "10:30 AM", isMine: false },
  { id: 2, sender: "You", text: "Hello! The project is going well. We're at 65% completion.", time: "10:32 AM", isMine: true },
  { id: 3, sender: "Priya Nair", text: "That's great! When will the project be ready?", time: "10:33 AM", isMine: false },
];

export default function Messages() {
  const [selected, setSelected] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [showList, setShowList] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Communicate with your team and clients</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden h-[calc(100vh-16rem)]">
        <div className="flex h-full">
          {/* Conversation list */}
          <div className={`w-full md:w-80 border-r border-border flex flex-col ${!showList ? "hidden md:flex" : "flex"}`}>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 rounded-xl" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => { setSelected(conv); setShowList(false); }}
                  className={`w-full text-left p-4 border-b border-border hover:bg-accent/50 transition-all duration-200 ${
                    selected.id === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-sm font-semibold text-white">{conv.name[0]}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{conv.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                      {conv.unread > 0 && (
                        <span className="h-5 w-5 rounded-full gradient-danger text-white text-xs flex items-center justify-center font-semibold shadow-sm">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${showList ? "hidden md:flex" : "flex"}`}>
            <div className="p-4 border-b border-border flex items-center gap-3 bg-accent/20">
              <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowList(true)}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">{selected.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <p className="text-xs text-muted-foreground">{selected.role}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.isMine ? "gradient-primary text-white" : "bg-muted text-foreground"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1.5 ${msg.isMine ? "text-white/70" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setNewMessage("")}
                  className="rounded-xl"
                />
                <Button size="icon" className="gradient-primary border-0 rounded-xl hover:opacity-90 transition-opacity shrink-0" onClick={() => setNewMessage("")}>
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
