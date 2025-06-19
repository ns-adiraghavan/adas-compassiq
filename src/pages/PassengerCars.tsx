
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const PassengerCars = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-8 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center">
          <h1 className="text-5xl font-thin mb-6 text-white tracking-tight">
            Passenger Cars
          </h1>
          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            Premium Automotive Intelligence - Coming Soon
          </p>
        </div>
      </div>
    </div>
  )
}

export default PassengerCars
