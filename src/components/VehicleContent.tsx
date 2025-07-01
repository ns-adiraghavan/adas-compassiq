
import { CSSProperties } from "react"

interface VehicleContentProps {
  icon: any
  title: string
  subtitle: string
  description: string
  textTransform: CSSProperties
}

const VehicleContent = ({ icon: Icon, title, subtitle, description, textTransform }: VehicleContentProps) => {
  return (
    <div 
      className="h-full flex flex-col justify-center space-y-6"
      style={textTransform}
    >
      {/* Icon and Title Section */}
      <div className="flex items-center space-x-6">
        <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110">
          <Icon className="h-12 w-12 text-white" />
        </div>
        <div>
          <h3 className="text-4xl xl:text-5xl font-light text-white mb-2 leading-tight">{title}</h3>
          <p className="text-xl xl:text-2xl text-white/70 font-light">{subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <p className="text-white/60 font-light leading-relaxed text-lg xl:text-xl max-w-2xl">
          {description}
        </p>
        
        {/* Call to Action */}
        <div className="flex items-center space-x-4 pt-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg">
            Explore Solutions
          </button>
          <button className="px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default VehicleContent
