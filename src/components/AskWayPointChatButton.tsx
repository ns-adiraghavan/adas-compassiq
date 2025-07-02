import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AskWayPointDialog from "./AskWayPointDialog";

const AskWayPointChatButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Ask WayPoint AI</span>
        </Button>
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
      </div>

      {/* Chat Dialog */}
      <AskWayPointDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};

export default AskWayPointChatButton;