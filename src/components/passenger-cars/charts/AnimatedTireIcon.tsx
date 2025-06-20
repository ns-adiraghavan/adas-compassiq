
import { useState, useEffect } from "react"
import { Circle } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

interface AnimatedTireIconProps {
  targetBarIndex: number
  chartData: Array<{ oem: string; count: number }>
  chartWidth: number
  onAnimationComplete?: () => void
}

const AnimatedTireIcon = ({ 
  targetBarIndex, 
  chartData, 
  chartWidth,
  onAnimationComplete 
}: AnimatedTireIconProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    if (targetBarIndex !== currentIndex && targetBarIndex >= 0) {
      setIsAnimating(true)
      
      const timer = setTimeout(() => {
        setCurrentIndex(targetBarIndex)
        setIsAnimating(false)
        onAnimationComplete?.()
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [targetBarIndex, currentIndex, onAnimationComplete])

  if (!chartData.length) return null

  const barWidth = (chartWidth - 100) / chartData.length // Account for margins
  const targetX = (targetBarIndex * barWidth) + (barWidth / 2) - 20 // Center on bar, adjust for tire size
  const currentX = (currentIndex * barWidth) + (barWidth / 2) - 20

  const currentFeatureCount = chartData[currentIndex]?.count || 0

  return (
    <div className="absolute top-4 left-0 pointer-events-none">
      {/* Tire Icon */}
      <div
        className={`relative transition-transform duration-800 ease-out ${isAnimating ? 'animate-tire-roll' : ''}`}
        style={{
          transform: `translateX(${isAnimating ? targetX : currentX}px)`,
          transitionProperty: 'transform'
        }}
      >
        <div className="relative">
          <Circle
            size={40}
            className={`${theme.primary} fill-current opacity-90`}
            strokeWidth={3}
          />
          {/* Tire tread pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-6 h-6 rounded-full border-2 ${theme.cardBorder} bg-transparent`}>
              <div className={`w-2 h-2 rounded-full ${theme.accent} mx-auto mt-2`}></div>
            </div>
          </div>
        </div>
        
        {/* Feature Count Badge */}
        <div 
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${theme.cardBackground} ${theme.cardBorder} border rounded-lg px-2 py-1 shadow-lg animate-count-fade`}
          key={currentIndex} // Force re-render for animation
        >
          <div className={`text-xs font-semibold ${theme.textPrimary} whitespace-nowrap`}>
            {currentFeatureCount} features
          </div>
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent ${theme.cardBorder.includes('border-white') ? 'border-t-white' : 'border-t-gray-800'}`}></div>
        </div>
      </div>
    </div>
  )
}

export default AnimatedTireIcon
