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

      {/* Test if dialog opens */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 1000000 }}
          onClick={() => setIsDialogOpen(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-black">Ask WayPoint AI</h2>
            <p className="text-black mb-4">Chat feature coming soon!</p>
            <button 
              onClick={() => setIsDialogOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AskWayPointChatButton;