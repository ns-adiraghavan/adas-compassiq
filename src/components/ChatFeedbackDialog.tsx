import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ChatFeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (category: string, description: string) => void
  isSubmitting: boolean
}

const ChatFeedbackDialog = ({ open, onOpenChange, onSubmit, isSubmitting }: ChatFeedbackDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [description, setDescription] = useState("")

  const feedbackCategories = [
    { value: "inaccurate", label: "Inaccurate information" },
    { value: "irrelevant", label: "Response not relevant to question" },
    { value: "incomplete", label: "Incomplete or missing information" },
    { value: "formatting", label: "Poor formatting or structure" },
    { value: "unhelpful", label: "Response not helpful" },
    { value: "other", label: "Other" }
  ]

  const handleSubmit = () => {
    if (!selectedCategory.trim()) return
    onSubmit(selectedCategory, description)
    setSelectedCategory("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Help us improve WayPoint AI</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">What was wrong with this response?</Label>
            <RadioGroup 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
              className="mt-2 space-y-2"
            >
              {feedbackCategories.map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={category.value} id={category.value} />
                  <Label htmlFor={category.value} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Additional details (optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide any additional context that could help us improve..."
              className="mt-1 min-h-[80px]"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedCategory.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatFeedbackDialog