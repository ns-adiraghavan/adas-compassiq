
import { CSSProperties } from "react"
import { Link } from "react-router-dom"

interface VehicleContentProps {
  icon: any
  title: string
  subtitle: string
  description: string
  textTransform: CSSProperties
  href?: string
}

const VehicleContent = ({ icon: Icon, title, subtitle, description, textTransform, href }: VehicleContentProps) => {
  return (
    <div 
      className="h-full flex flex-col justify-center space-y-6"
      style={textTransform}
    >
      {/* Icon and Title Section */}
      {href ? (
        <Link to={href} className="group cursor-pointer">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110">
              <Icon className="h-12 w-12 text-white" />
            </div>
            <div>
              <h3 className="text-4xl xl:text-5xl font-light text-white mb-2 leading-tight group-hover:text-green-300 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-xl xl:text-2xl text-white/70 font-light">{subtitle}</p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-110">
            <Icon className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-4xl xl:text-5xl font-light text-white mb-2 leading-tight">{title}</h3>
            <p className="text-xl xl:text-2xl text-white/70 font-light">{subtitle}</p>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="space-y-4">
        <p className="text-white/60 font-light leading-relaxed text-lg xl:text-xl max-w-2xl">
          {description}
        </p>
      </div>
    </div>
  )
}

export default VehicleContent
