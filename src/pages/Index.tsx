
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Car, ArrowRight } from "lucide-react"

const Index = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-primary/10 rounded-full">
            <Car className="w-20 h-20 text-primary" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Automotive Intelligence Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive insights into autonomous driving systems, ADAS technologies, and the competitive landscape of self-driving innovation
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Button
            size="lg"
            onClick={() => navigate("/ad-adas-cars")}
            className="text-lg px-8 py-6 group"
          >
            Explore AD/ADAS Intelligence
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Current Snapshot</h3>
            <p className="text-muted-foreground">Real-time AV landscape analysis</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Core Systems</h3>
            <p className="text-muted-foreground">Technology stack insights</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Future Blueprint</h3>
            <p className="text-muted-foreground">Roadmap & investments</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
