
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
      className="flex-1 relative z-10"
      style={textTransform}
    >
      <div className="flex items-center mb-8">
        <div className="p-4 bg-white/20 rounded-3xl mr-6 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <div>
          <h3 className="text-4xl font-light text-white mb-2">{title}</h3>
          <p className="text-xl text-white/70 font-light">{subtitle}</p>
        </div>
      </div>
      <p className="text-white/60 font-light leading-relaxed mb-8 text-lg max-w-2xl">
        {description}
      </p>
      <div className="flex items-center text-white/80 font-medium group-hover:text-white transition-colors text-lg">
        <span className="mr-3">Explore</span>
        <span className="transform group-hover:translate-x-2 transition-transform text-2xl">→</span>
      </div>
    </div>
  )
}

export default VehicleContent
