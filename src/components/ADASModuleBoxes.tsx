import { Link } from "react-router-dom"
import { Brain, Target, Rocket, Network } from "lucide-react"

const ADASModuleBoxes = () => {
  const modules = [
    {
      title: "Current Snapshot",
      icon: Target,
      href: "/ad-adas-cars/current-snapshot",
      description: "Real-time analysis of the autonomous vehicle landscape",
      subsections: [
        "AV Landscape",
        "Portfolio Dynamics",
        "Operational Design Domain (ODD)"
      ],
      gradient: "from-green-600 to-emerald-500"
    },
    {
      title: "Core Systems Breakdown",
      icon: Brain,
      href: "/ad-adas-cars/core-systems",
      description: "Deep dive into the technical architecture of AD/ADAS systems",
      subsections: [
        "Sensorics",
        "Computational Core",
        "Driving Intelligence",
        "Connectivity & Localization",
        "Advanced Technologies"
      ],
      gradient: "from-emerald-600 to-green-500"
    },
    {
      title: "Future Blueprint",
      icon: Rocket,
      href: "/ad-adas-cars/future-blueprint",
      description: "Strategic roadmaps and technology investment analysis",
      subsections: [
        "Global Footprint",
        "Key Technology Investments",
        "Core Technology Roadmap",
        "Vehicle-Level Roadmap"
      ],
      gradient: "from-green-700 to-emerald-600"
    },
    {
      title: "Ecosystem",
      icon: Network,
      href: "/ad-adas-cars/ecosystem",
      description: "Partnership networks and industry collaboration mapping",
      subsections: [
        "OEM Partnerships",
        "Supplier Networks",
        "Technology Alliances"
      ],
      gradient: "from-emerald-700 to-green-700"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 px-6">
      {modules.map((module, index) => (
        <Link
          key={module.title}
          to={module.href}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-green-500/20 p-6 hover:border-green-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Background gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          {/* Icon */}
          <div className="relative mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <module.icon className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
              {module.title}
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {module.description}
            </p>

            {/* Subsections */}
            <div className="space-y-1">
              <p className="text-xs text-green-400 font-semibold mb-2">Key Areas:</p>
              <ul className="space-y-1">
                {module.subsections.map((subsection) => (
                  <li key={subsection} className="text-xs text-gray-500 flex items-center">
                    <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                    {subsection}
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow indicator */}
            <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ADASModuleBoxes
