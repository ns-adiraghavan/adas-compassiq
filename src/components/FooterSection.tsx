
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import FileUpload from "@/components/FileUpload"

const FooterSection = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  const handleFileAnalyzed = (analysis: any) => {
    console.log('File uploaded:', analysis)
    // You can add additional handling here if needed
  }

  return (
    <section className="section relative py-20 bg-gradient-to-t from-gray-900 to-black">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join the future of automotive intelligence with WayPoint
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button 
            size="lg"
            className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="sm"
            variant="outline"
            className="bg-transparent border-gray-500 text-gray-400 hover:bg-gray-800 hover:text-white text-sm px-4 py-2 rounded-lg transition-all duration-300"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            2025 © Netscribes. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl bg-black/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              Upload Files
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowUploadDialog(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <FileUpload onFileAnalyzed={handleFileAnalyzed} />
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default FooterSection
