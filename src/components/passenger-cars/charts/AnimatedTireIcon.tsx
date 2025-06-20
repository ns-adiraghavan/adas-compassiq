
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
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const { theme } = useTheme()

  // Auto ping-pong movement
  useEffect(() => {
    if (!chartData.length) return

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        let nextIndex = prevIndex + direction
        let newDirection = direction

        // Bounce at boundaries
        if (nextIndex >= chartData.length - 1) {
          nextIndex = chartData.length - 1
          newDirection = -1
        } else if (nextIndex <= 0) {
          nextIndex = 0
          newDirection = 1
        }

        setDirection(newDirection)
        return nextIndex
      })
    }, 1500) // Move every 1.5 seconds

    return () => clearInterval(interval)
  }, [chartData.length, direction])

  // Handle manual target changes (hover)
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

  const barWidth = (chartWidth - 100) / chartData.length
  const currentX = (currentIndex * barWidth) + (barWidth / 2) - 25 // Center on bar, adjust for wheel size

  const currentFeatureCount = chartData[currentIndex]?.count || 0

  return (
    <div className="absolute top-4 left-0 pointer-events-none">
      {/* Realistic Wheel */}
      <div
        className={`relative transition-all duration-1000 ease-in-out transform ${isAnimating ? 'animate-tire-bounce' : 'animate-tire-roll-continuous'}`}
        style={{
          transform: `translateX(${currentX}px) translateY(-10px)`,
          transitionProperty: 'transform'
        }}
      >
        <div className="relative">
          {/* Outer tire */}
          <div className="relative w-12 h-12 rounded-full bg-gray-800 border-4 border-gray-600 shadow-lg">
            {/* Inner rim */}
            <div className="absolute inset-2 rounded-full bg-gray-300 border-2 border-gray-400">
              {/* Center hub */}
              <div className="absolute inset-2 rounded-full bg-gray-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-800"></div>
              </div>
              {/* Spokes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-0.5 h-full bg-gray-500"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rotate-45">
                <div className="w-0.5 h-full bg-gray-500"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rotate-90">
                <div className="w-0.5 h-full bg-gray-500"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rotate-[135deg]">
                <div className="w-0.5 h-full bg-gray-500"></div>
              </div>
            </div>
            {/* Tire tread pattern */}
            <div className="absolute inset-0 rounded-full">
              <div className="absolute top-1 left-1 w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Feature Count Badge */}
        <div 
          className={`absolute -top-10 left-1/2 transform -translate-x-1/2 ${theme.cardBackground} ${theme.cardBorder} border rounded-lg px-3 py-1 shadow-lg animate-count-fade`}
          key={currentIndex}
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
