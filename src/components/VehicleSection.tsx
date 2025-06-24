
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

interface VehicleCategory {
  title: string
  subtitle: string
  description: string
  image: string
  icon: React.ComponentType<any>
  href: string
  color: string
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

  // Navigation tabs for Passenger Cars
  const passengerCarsNavigation = [
    { name: 'Landscape', path: '/passenger-cars/landscape' },
    { name: 'Category Analysis', path: '/passenger-cars/analytics' },
    { name: 'Vehicle Segment Analysis', path: '/passenger-cars/intelligence' },
    { name: 'Business Model Analysis', path: '/passenger-cars/modeling' },
    { name: 'Insights', path: '/passenger-cars/insights' },
  ]

  return (
    <section className="section min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex items-center gap-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
          {/* Image Side */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={{ opacity: isActive ? 1 : 0.7, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-3xl blur-xl`} />
              <img
                src={category.image}
                alt={category.title}
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className="flex-1 space-y-8"
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={{ opacity: isActive ? 1 : 0.7, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} shadow-lg`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {category.title}
                </h2>
                <p className="text-xl text-gray-300 font-light">
                  {category.subtitle}
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              {category.description}
            </p>

            {/* Navigation Tabs for Passenger Cars */}
            {category.title === "Passenger Cars" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {passengerCarsNavigation.map((nav, navIndex) => (
                    <Link
                      key={nav.name}
                      to={nav.path}
                      className={`group flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        navIndex < 3 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      }`}
                    >
                      <span className="group-hover:scale-105 transition-transform duration-200">
                        {nav.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* Default Explore button for other categories */
              <Link
                to={category.href}
                className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${category.color} text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                Explore
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default VehicleSection
