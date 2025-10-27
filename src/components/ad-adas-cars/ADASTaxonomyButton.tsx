import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useADASTaxonomy } from "@/hooks/useADASTaxonomy"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ADASTaxonomyButton = () => {
  const { data, isLoading, error } = useADASTaxonomy()

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Taxonomy
        </Button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-[800px] p-0 bg-background/98 backdrop-blur-sm border shadow-2xl z-50"
        side="bottom"
        align="start"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">AD/ADAS Taxonomy</h3>
          
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading taxonomy...
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-destructive">
              Failed to load taxonomy data
            </div>
          )}
          
          {data && data.length > 0 && (
            <ScrollArea className="h-[500px] rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead className="w-[200px]">Parameter</TableHead>
                    <TableHead className="w-[200px]">Attribute</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-xs align-top">
                        {row['Module 1: OEM-level Benchmarking']}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        {row['']}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        {row['__1']}
                      </TableCell>
                      <TableCell className="text-xs align-top">
                        {row['__2']}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ADASTaxonomyButton
