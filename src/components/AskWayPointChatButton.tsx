import { useState } from "react";
import { MessageCircle } from "lucide-react";
import AskWayPointDialog from "./AskWayPointDialog";

const AskWayPointChatButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked successfully!');
    setIsDialogOpen(true);
  };

  console.log('Rendering chat button, current state:', isDialogOpen);

  return (
    <>
      {/* Simplified floating button with maximum z-index */}
      <button
        onClick={handleButtonClick}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer border-2 border-white"
        style={{ 
          zIndex: 999999,
          pointerEvents: 'auto',
          position: 'fixed'
        }}
        type="button"
      >
        <MessageCircle className="h-6 w-6 mx-auto" />
      </button>

      {/* Chat Dialog - Full functionality restored */}
      <AskWayPointDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};

export default AskWayPointChatButton;