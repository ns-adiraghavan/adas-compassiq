
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
            title: "Connected Feature Module",
            description: "Advanced connectivity and IoT integration"
          },
          {
            icon: Shield,
            title: "Autonomous Driving-ADAS Module",
            description: "Advanced driver assistance and safety systems"
          },
          {
            icon: Monitor,
            title: "Digital Cockpit Module",
            description: "Next-generation infotainment and displays"
          },
          {
            icon: Battery,
            title: "Electric Powertrain and Battery",
            description: "Sustainable electric mobility solutions"
          }
        ]
      
      case "Two Wheelers":
        return [
          {
            icon: Zap,
            title: "Electric Drive Systems",
            description: "Efficient electric motor technology"
          },
          {
            icon: Wifi,
            title: "Smart Connectivity",
            description: "IoT-enabled two-wheeler solutions"
          },
          {
            icon: Shield,
            title: "Safety & Security",
            description: "Anti-theft and rider safety features"
          },
          {
            icon: Battery,
            title: "Battery Management",
            description: "Advanced battery technology and charging"
          }
        ]
      
      case "Commercial Vehicles":
        return [
          {
            icon: Navigation,
            title: "Fleet Management",
            description: "Real-time tracking and optimization"
          },
          {
            icon: Fuel,
            title: "Fuel Efficiency",
            description: "Advanced engine and fuel management"
          },
          {
            icon: Shield,
            title: "Cargo Security",
            description: "Load monitoring and security systems"
          },
          {
            icon: Cpu,
            title: "Telematics",
            description: "Advanced vehicle data analytics"
          }
        ]
      
      case "Agriculture Vehicles":
        return [
          {
            icon: Cpu,
            title: "Precision Agriculture",
            description: "GPS-guided farming automation"
          },
          {
            icon: Monitor,
            title: "Smart Displays",
            description: "Intuitive operator interfaces"
          },
          {
            icon: Zap,
            title: "Hybrid Powertrains",
            description: "Efficient diesel-electric systems"
          },
          {
            icon: Wifi,
            title: "Farm Connectivity",
            description: "IoT integration for smart farming"
          }
        ]
      
      default:
        return []
    }
  }

  const modules = getModules()

  return (
    <div className="mt-12 mb-8">
      <h4 className="text-2xl font-light text-white mb-6 text-center">Feature Modules</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((module, index) => (
          <div 
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover:bg-white/15 text-center"
          >
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <module.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h5 className="text-white font-medium text-sm mb-2">{module.title}</h5>
            <p className="text-white/60 text-xs leading-relaxed">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeatureModules
