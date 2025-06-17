
import { useState, useEffect, useRef } from "react"

export const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        
        // Check if section is in viewport
        const isInView = rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2
        setIsVisible(isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate animation values based on scroll position
  const getImageTransform = () => {
    if (!sectionRef.current) return {}
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Calculate progress (0 to 1) as element enters viewport
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.8)))
    
    // Scale from 0.8 to 1.05 with easing
    const scale = 0.8 + (progress * 0.25)
    
    // Opacity from 0 to 1
    const opacity = progress
    
    // Slight parallax movement
    const translateY = (1 - progress) * 50
    
    return {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      opacity,
      transition: 'none' // Smooth scroll, no CSS transitions
    }
  }

  // Calculate text slide animation
  const getTextTransform = (isEven: boolean) => {
    if (!sectionRef.current) return {}
    
    const rect = sectionRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    
    // Calculate progress (0 to 1) as element enters viewport
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.9)))
    
    // Slide in from left or right based on layout
    const translateX = isEven 
      ? (1 - progress) * 80  // Slide from right when image is on left
      : (1 - progress) * -80 // Slide from left when image is on right
    
    // Opacity and slight vertical movement
    const opacity = Math.max(0.3, progress)
    const translateY = (1 - progress) * 20
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px)`,
      opacity,
      transition: 'none'
    }
  }

  return {
    scrollY,
    isVisible,
    sectionRef,
    getImageTransform,
    getTextTransform
  }
}
