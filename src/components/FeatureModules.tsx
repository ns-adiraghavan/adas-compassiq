
import { Zap, Shield, Monitor, Battery, Wifi, Cpu, Navigation, Fuel } from "lucide-react"

interface FeatureModulesProps {
  vehicleType: string
}

const FeatureModules = ({ vehicleType }: FeatureModulesProps) => {
  const getModules = () => {
    switch (vehicleType) {
      case "Passenger Cars":
        return [
          {
            icon: Wifi,
            title: "Connected Feature Module"
          },
          {
            icon: Shield,
            title: "Autonomous Driving-ADAS Module"
          },
          {
            icon: Monitor,
            title: "Digital Cockpit Module"
          },
          {
            icon: Battery,
            title: "Electric Powertrain and Battery"
          }
        ]
      
      case "Two Wheelers":
        return [
          {
            icon: Zap,
            title: "Electric Drive Systems"
          },
          {
            icon: Wifi,
            title: "Smart Connectivity"
          },
          {
            icon: Shield,
            title: "Safety & Security"
          },
          {
            icon: Battery,
            title: "Battery Management"
          }
        ]
      
      case "Commercial Vehicles":
        return [
          {
            icon: Navigation,
            title: "Fleet Management"
          },
          {
            icon: Fuel,
            title: "Fuel Efficiency"
          },
          {
            icon: Shield,
            title: "Cargo Security"
          },
          {
            icon: Cpu,
            title: "Telematics"
          }
        ]
      
      case "Agriculture Vehicles":
        return [
          {
            icon: Cpu,
            title: "Precision Agriculture"
          },
          {
            icon: Monitor,
            title: "Smart Displays"
          },
          {
            icon: Zap,
            title: "Hybrid Powertrains"
          },
          {
            icon: Wifi,
            title: "Farm Connectivity"
          }
        ]
      
      default:
        return []
    }
  }

  const modules = getModules()

  return (
    <div className="mt-12 mb-8">
      <h4 className="text-2xl font-light text-white mb-8 text-center animate-fade-in">
        Feature Modules
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <div 
            key={index}
            className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 
                     hover:border-white/40 transition-all duration-500 hover:bg-white/15 text-center
                     animate-fade-in hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20
                     transform-gpu cursor-pointer relative overflow-hidden min-h-[120px] flex flex-col justify-center"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'both'
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-pink-600/0 
                          group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 
                          transition-all duration-500 rounded-2xl"></div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300 
                              group-hover:scale-110 group-hover:rotate-3 transform-gpu">
                  <module.icon className="h-8 w-8 text-white group-hover:text-blue-200 transition-colors duration-300" />
                </div>
              </div>
              
              <h5 className="text-white font-medium text-sm leading-tight group-hover:text-blue-100 transition-colors duration-300">
                {module.title}
              </h5>
            </div>
            
            {/* Hover border effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r 
                          group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureModules
