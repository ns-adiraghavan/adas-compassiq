
import { Link } from "react-router-dom"
import { LucideIcon } from "lucide-react"

interface VehicleCategory {
  title: string
  subtitle: string
  description: string
  image: string
  icon: LucideIcon
  href: string
  color: string
  buttonColor?: string
  shadowColor?: string
}

interface VehicleSectionProps {
  category: VehicleCategory
  index: number
  currentSection: number
  sectionIndex: number
}

const VehicleSection = ({ category, index, currentSection, sectionIndex }: VehicleSectionProps) => {
  const isEven = index % 2 === 0
  const isActive = currentSection === sectionIndex

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-8">
      <div className="container mx-auto max-w-7xl">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
          {/* Image */}
          <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} relative`}>
            <div className="relative z-10">
              <img
                src={category.image}
                alt={category.title}
                className={`w-full h-auto rounded-2xl shadow-2xl transition-all duration-1000 ${
                  isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-80'
                }`}
                style={{
                  filter: isActive ? 'brightness(1.1)' : 'brightness(0.9)',
                }}
              />
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 rounded-2xl blur-3xl`}></div>
          </div>

          {/* Content */}
          <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-8`}>
            <div className="space-y-4">
              <div className={`inline-flex items-center space-x-3 transition-all duration-700 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-60'
              }`}>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {category.subtitle}
                </span>
              </div>
              
              <h2 className={`text-5xl lg:text-6xl font-bold bg-gradient-to-br ${category.color} bg-clip-text text-transparent transition-all duration-700 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-60'
              }`}>
                {category.title}
              </h2>
              
              <p className={`text-xl text-gray-300 leading-relaxed max-w-lg transition-all duration-700 delay-200 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-60'
              }`}>
                {category.description}
              </p>
            </div>

            <div className={`transition-all duration-700 delay-400 ${
              isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-60'
            }`}>
              <Link
                to={category.href}
                className={`inline-flex items-center px-8 py-4 text-lg font-semibold text-white ${
                  category.buttonColor || `bg-gradient-to-r ${category.color}`
                } rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  category.shadowColor || 'hover:shadow-xl'
                } hover:shadow-2xl group animate-pulse-slow hover:animate-none`}
              >
                <span className="mr-3">Explore Platform</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleSection
