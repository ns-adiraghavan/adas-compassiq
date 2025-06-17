
import { Car, Upload } from "lucide-react"
import { Link } from "react-router-dom"

interface VehicleCategory {
  title: string
  subtitle: string
  description: string
  image: string
  icon: any
  href: string
  color: string
}

interface VehicleSectionProps {
  category?: VehicleCategory
  index?: number
  currentSection?: number
  sectionIndex?: number
}

const VehicleSection = ({ category, index, currentSection, sectionIndex }: VehicleSectionProps) => {
  // If category prop is provided, render single category
  if (category) {
    const Icon = category.icon
    return (
      <section className="py-20 px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to={category.href} className="group block">
            <div className={`bg-gradient-to-br ${category.color}/20 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15 relative overflow-hidden`}>
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white/20 rounded-2xl mr-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white">{category.title}</h3>
                    <p className="text-lg text-white/70 font-light">{category.subtitle}</p>
                  </div>
                </div>
                <p className="text-white/60 font-light leading-relaxed mb-6">
                  {category.description}
                </p>
                <div className="flex items-center text-white/80 font-medium group-hover:text-white transition-colors">
                  <span className="mr-2">Explore</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    )
  }

  // Default two-card layout if no category prop
  return (
    <section className="py-20 px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-thin mb-6 text-white tracking-tight">
            Comprehensive Vehicle Intelligence
          </h2>
          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            Advanced analytics and insights across all vehicle categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Passenger Cars Card */}
          <Link to="/passenger-cars" className="group block">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-500/20 rounded-2xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <Car className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-light text-white">Passenger Cars</h3>
              </div>
              <p className="text-white/60 font-light leading-relaxed mb-6">
                Detailed analytics for passenger vehicles including market segmentation, 
                feature analysis, and competitive intelligence across global markets.
              </p>
              <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                <span className="mr-2">Explore Analytics</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Document Analysis Card */}
          <Link to="/document-analysis" className="group block">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:bg-white/15">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-500/20 rounded-2xl mr-4 group-hover:bg-purple-500/30 transition-colors">
                  <Upload className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-light text-white">Document Intelligence</h3>
              </div>
              <p className="text-white/60 font-light leading-relaxed mb-6">
                Upload PDF and PowerPoint documents for AI-powered analysis. Generate intelligent 
                dashboards that correlate with your automotive data.
              </p>
              <div className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                <span className="mr-2">Upload & Analyze</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default VehicleSection
