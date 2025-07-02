import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AskWayPointDialog from "./AskWayPointDialog";

const AskWayPointChatButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = () => {
    console.log('Ask WayPoint button clicked!');
    setIsDialogOpen(true);
    console.log('Dialog should open, isDialogOpen:', true);
  };

  return (
    <>
      {/* Floating Chat Button with higher z-index */}
      <div className="fixed bottom-6 right-6 z-[9999]" style={{ pointerEvents: 'all' }}>
        <Button
          onClick={handleButtonClick}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
          size="icon"
          style={{ pointerEvents: 'all', zIndex: 10000 }}
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