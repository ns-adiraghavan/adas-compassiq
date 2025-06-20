
import { useState, useEffect, useRef } from "react"
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
  const [isJumping, setIsJumping] = useState(false)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  const [isHoverOverride, setIsHoverOverride] = useState(false)
  const { theme } = useTheme()
  const animationRef = useRef<number>()

  // Chart layout constants
  const CHART_LEFT_MARGIN = 20
  const CHART_RIGHT_MARGIN = 30
  const CHART_TOP_MARGIN = 60
  const TIRE_SIZE = 48
  const JUMP_DURATION = 1500 // 1.5 seconds

  // Calculate bar positions
  const getBarPosition = (index: number) => {
    if (!chartData.length) return 0
    
    const availableWidth = chartWidth - CHART_LEFT_MARGIN - CHART_RIGHT_MARGIN
    const barWidth = availableWidth / chartData.length
    const barCenterX = CHART_LEFT_MARGIN + (index * barWidth) + (barWidth / 2) - (TIRE_SIZE / 2)
    
    return barCenterX
  }

  // Auto ping-pong movement
  useEffect(() => {
    if (!chartData.length || isHoverOverride) return

    const moveToNextBar = () => {
      setIsJumping(true)
      
      // Calculate next position
      const nextIndex = currentIndex + direction
      let newDirection = direction
      let finalIndex = nextIndex

      // Handle boundaries with ping-pong effect
      if (nextIndex >= chartData.length) {
        finalIndex = chartData.length - 2
        newDirection = -1
      } else if (nextIndex < 0) {
        finalIndex = 1
        newDirection = 1
      }

      // Animate to new position
      setTimeout(() => {
        setCurrentIndex(finalIndex)
        setDirection(newDirection)
        setIsJumping(false)
      }, JUMP_DURATION)
    }

    const interval = setInterval(moveToNextBar, 2000) // Move every 2 seconds
    return () => clearInterval(interval)
  }, [currentIndex, direction, chartData.length, isHoverOverride])

  // Handle hover target changes
  useEffect(() => {
    if (targetBarIndex >= 0 && targetBarIndex !== currentIndex) {
      setIsHoverOverride(true)
      setIsJumping(true)
      
      const timer = setTimeout(() => {
        setCurrentIndex(targetBarIndex)
        setIsJumping(false)
        onAnimationComplete?.()
      }, JUMP_DURATION)

      return () => clearTimeout(timer)
    } else if (targetBarIndex === -1) {
      // Reset to auto mode
      setIsHoverOverride(false)
    }
  }, [targetBarIndex, currentIndex, onAnimationComplete])

  if (!chartData.length) return null

  const currentX = getBarPosition(currentIndex)
  const currentFeatureCount = chartData[currentIndex]?.count || 0

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        top: `${CHART_TOP_MARGIN - TIRE_SIZE - 10}px`,
        left: '0px',
        width: '100%',
        height: `${TIRE_SIZE + 60}px`
      }}
    >
      {/* Realistic Tire */}
      <div
        className={`absolute transition-transform duration-1500 ease-out ${isJumping ? 'animate-tire-jump' : ''}`}
        style={{
          transform: `translateX(${currentX}px)`,
          width: `${TIRE_SIZE}px`,
          height: `${TIRE_SIZE}px`,
        }}
      >
        {/* Outer tire */}
        <div className="relative w-full h-full rounded-full bg-gray-800 border-4 border-gray-600 shadow-xl">
          {/* Tire tread pattern */}
          <div className="absolute inset-1 rounded-full">
            {/* Tread blocks around the circumference */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-gray-500 rounded-sm"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0.125rem 0rem',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${TIRE_SIZE/2 - 8}px)`
                }}
              />
            ))}
          </div>
          
          {/* Inner rim */}
          <div className="absolute inset-3 rounded-full bg-gray-300 border-2 border-gray-400 shadow-inner">
            {/* Center hub */}
            <div className="absolute inset-2 rounded-full bg-gray-600 flex items-center justify-center shadow-inner">
              <div className="w-3 h-3 rounded-full bg-gray-800 shadow-sm"></div>
            </div>
            
            {/* Spokes */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-full bg-gray-500 opacity-80"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0.125rem 0rem',
                  transform: `translate(-50%, -50%) rotate(${i * 72}deg)`
                }}
              />
            ))}
          </div>
          
          {/* Valve stem */}
          <div 
            className="absolute w-1 h-2 bg-gray-700 rounded-sm"
            style={{
              top: '10%',
              right: '40%',
              transform: 'rotate(15deg)'
            }}
          />
        </div>
        
        {/* Feature Count Badge - Below the tire */}
        <div 
          className={`absolute top-full mt-3 left-1/2 transform -translate-x-1/2 ${theme.cardBackground} ${theme.cardBorder} border rounded-lg px-3 py-2 shadow-lg animate-count-fade`}
          key={`${currentIndex}-${currentFeatureCount}`}
        >
          <div className={`text-sm font-semibold ${theme.textPrimary} whitespace-nowrap text-center`}>
            {currentFeatureCount}
          </div>
          <div className={`text-xs ${theme.textMuted} text-center`}>
            features
          </div>
          {/* Arrow pointing up to tire */}
          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent ${theme.cardBorder.includes('border-white') ? 'border-b-white' : 'border-b-gray-800'}`}></div>
        </div>
      </div>
    </div>
  )
}

export default AnimatedTireIcon
