import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useAskWayPointChat } from "@/hooks/useAskWayPointChat";
import { useTheme } from "@/contexts/ThemeContext";
import ReactMarkdown from "react-markdown";

interface AskWayPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AskWayPointDialog = ({ open, onOpenChange }: AskWayPointDialogProps) => {
  console.log('AskWayPointDialog rendering, open:', open);
  
  const [inputMessage, setInputMessage] = useState("");
  const { theme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    addWelcomeMessage,
    currentSection
  } = useAskWayPointChat();

  // Add welcome message when dialog opens
  useEffect(() => {
    if (open) {
      addWelcomeMessage();
    }
  }, [open, addWelcomeMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const messageToSend = inputMessage;
    setInputMessage("");
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSectionDisplayName = (section: string) => {
    switch (section) {
      case 'landscape': return 'Landscape Analysis';
      case 'analytics': return 'Category Analysis';
      case 'intelligence': return 'Vehicle Segment Analysis';
      case 'modeling': return 'Business Model Analysis';
      case 'insights': return 'Strategic Insights';
      default: return 'Connected Features';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme.cardBackground} border-2 ${theme.cardBorder} max-w-2xl h-[85vh] flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className={`${theme.textPrimary} text-xl font-semibold flex items-center gap-2`}>
            <Bot className="h-6 w-6 text-blue-500" />
            Ask WayPoint AI
          </DialogTitle>
          <p className={`${theme.textMuted} text-sm`}>
            Get insights about connected car features • Currently viewing: {getSectionDisplayName(currentSection)}
          </p>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-4" style={{ maxHeight: 'calc(85vh - 200px)' }}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-purple-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : `${theme.cardBackground} border ${theme.cardBorder} ${theme.textPrimary}`
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="text-sm">
                        <ReactMarkdown 
                          className="prose prose-sm max-w-none [&>*]:mb-3 [&>p]:mb-2 [&>ul]:mb-3 [&>ol]:mb-3 [&>h1]:mb-3 [&>h2]:mb-3 [&>h3]:mb-2 [&>h4]:mb-2 [&>h5]:mb-2 [&>h6]:mb-2"
                          components={{
                            p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-blue-400">{children}</strong>,
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-blue-300">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-blue-300">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-blue-300">{children}</h3>,
                            code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">{children}</code>,
                            blockquote: ({ children }) => <blockquote className="border-l-2 border-blue-400 pl-3 mb-2 italic">{children}</blockquote>
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    )}
                    <p className={`text-xs mt-1 opacity-70`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className={`${theme.cardBackground} border ${theme.cardBorder} rounded-lg p-3 flex items-center gap-2`}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className={`text-sm ${theme.textMuted}`}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 flex gap-2 pt-4 border-t border-border">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about connected car features, OEM strategies, market trends..."
            className={`flex-1 ${theme.cardBackground} border ${theme.cardBorder}`}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="flex-shrink-0 mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AskWayPointDialog;