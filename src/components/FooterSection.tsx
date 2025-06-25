
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const FooterSection = () => {
  return (
    <section className="section relative py-20 bg-gradient-to-t from-gray-900 to-black">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join the future of automotive intelligence with WayPoint
        </p>
        <Button 
          size="lg"
          className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
        >
          Get Started Today
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      {/* Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            2025 © Netscribes. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  )
}

export default FooterSection
