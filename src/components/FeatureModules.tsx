
import { Zap, Shield, Monitor, Battery, Wifi, Cpu, Navigation, Fuel } from "lucide-react"
import { Link } from "react-router-dom"

interface FeatureModulesProps {
  vehicleType: string
}

const FeatureModules = ({ vehicleType }: FeatureModulesProps) => {
  const getModules = () => {
    switch (vehicleType) {
      case "Autonomous Driving & Advanced Safety":
        return [
          {
            icon: Wifi,
            title: "Connected Feature Module",
            isLinked: true,
            href: "/passenger-cars"
          },
          {
            icon: Shield,
            title: "Autonomous AD/AS",
            isLinked: true,
            href: "/ad-adas-cars"
          }
        ]
      
      case "Passenger Cars":
        return [
          {
            icon: Wifi,
            title: "Connected Feature Module",
            isLinked: true,
            href: "/passenger-cars"
          },
          {
            icon: Shield,
            title: "Autonomous Driving-ADAS Module",
            isLinked: true,
            href: "/ad-adas-cars"
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

  const renderModule = (module: any, index: number) => {
    const moduleContent = (
      <>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 via-emerald-600/0 to-green-500/0 
                      group-hover:from-green-600/10 group-hover:via-emerald-600/10 group-hover:to-green-500/10 
                      transition-all duration-500 rounded-2xl"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-2 right-2 w-1 h-1 bg-green-400/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-3 w-1 h-1 bg-emerald-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-green-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-600/20 rounded-xl group-hover:bg-green-500/30 transition-all duration-300 
                          group-hover:scale-110 group-hover:rotate-3 transform-gpu border border-green-500/30">
              <module.icon className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
            </div>
          </div>
          
          <h5 className="text-white font-bold text-sm leading-tight group-hover:text-green-300 transition-colors duration-300">
            {module.title}
          </h5>
        </div>
        
        {/* Hover border effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-500/50 
                      transition-all duration-300"></div>
      </>
    )

    const baseClasses = "group bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-500 hover:bg-slate-900/80 text-center animate-fade-in hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 transform-gpu relative overflow-hidden min-h-[120px] flex flex-col justify-center"

    if (module.isLinked && module.href) {
      return (
        <Link
          key={index}
          to={module.href}
          className={`${baseClasses} cursor-pointer`}
          style={{ 
            animationDelay: `${index * 150}ms`,
            animationFillMode: 'both'
          }}
        >
          {moduleContent}
        </Link>
      )
    }

    return (
      <div 
        key={index}
        className={`${baseClasses} cursor-pointer`}
        style={{ 
          animationDelay: `${index * 150}ms`,
          animationFillMode: 'both'
        }}
      >
        {moduleContent}
      </div>
    )
  }

  return (
    <div className="mt-12 mb-8">
      <h4 className="text-2xl font-bold text-white mb-8 text-center animate-fade-in">
        Feature Modules
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {modules.map((module, index) => renderModule(module, index))}
      </div>
    </div>
  )
}

export default FeatureModules
