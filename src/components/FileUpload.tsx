
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, Presentation, Loader2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFileAnalyzed: (analysis: any) => void
}

const FileUpload = ({ onFileAnalyzed }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; analysis?: any }>>([])
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    for (const file of Array.from(files)) {
      if (!file.type.includes('pdf') && !file.type.includes('presentation') && !file.name.endsWith('.pptx')) {
        toast({
          title: "Invalid file type",
          description: "Please upload only PDF or PPTX files.",
          variant: "destructive"
        })
        continue
      }

      try {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const result = reader.result as string
            resolve(result.split(',')[1]) // Remove data:... prefix
          }
          reader.readAsDataURL(file)
        })

        // Call edge function to analyze document
        const { data, error } = await supabase.functions.invoke('document-analysis', {
          body: {
            fileName: file.name,
            fileType: file.type,
            fileContent: base64
          }
        })

        if (error) {
          throw error
        }

        const newFile = {
          name: file.name,
          type: file.type,
          analysis: data.analysis
        }

        setUploadedFiles(prev => [...prev, newFile])
        onFileAnalyzed(data.analysis)

        toast({
          title: "File analyzed successfully",
          description: `${file.name} has been processed and analyzed.`
        })

      } catch (error) {
        console.error('Error analyzing file:', error)
        toast({
          title: "Analysis failed",
          description: `Failed to analyze ${file.name}. Please try again.`,
          variant: "destructive"
        })
      }
    }

    setIsUploading(false)
    // Reset input
    event.target.value = ''
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes('presentation') || type.includes('pptx')) return <Presentation className="h-5 w-5 text-orange-500" />
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-light text-white mb-4">Upload Documents for AI Analysis</h3>
          <p className="text-white/60 font-light">
            Upload PDF or PowerPoint files to generate intelligent dashboards based on document content and passenger car data.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button 
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </>
                  )}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.pptx,.ppt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <p className="text-white/40 text-sm">Supports PDF and PPTX files</p>
          </div>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 p-6 backdrop-blur-sm">
          <h4 className="text-lg font-light text-white mb-4">Analyzed Documents</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                {getFileIcon(file.type)}
                <span className="text-white font-medium flex-1">{file.name}</span>
                <span className="text-green-400 text-sm">✓ Analyzed</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default FileUpload
