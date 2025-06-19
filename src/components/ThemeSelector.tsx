
import { Palette } from "lucide-react"
import { useTheme, ThemeType } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themeColors = {
    midnight: 'from-blue-600 to-cyan-500',
    emerald: 'from-emerald-600 to-amber-500',
    sunset: 'from-orange-600 to-pink-500',
    royal: 'from-purple-600 to-pink-500',
    arctic: 'from-slate-600 to-blue-500'
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/30 transition-all"
          size="sm"
        >
          <Palette className="h-4 w-4 mr-2" />
          Themes
        </Button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 p-3 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 min-w-[200px]">
            <h3 className="text-white text-sm font-medium mb-3">Choose Theme</h3>
            <div className="space-y-2">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key as ThemeType)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-md transition-all ${
                    currentTheme === key 
                      ? 'bg-white/20 border border-white/30' 
                      : 'hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div 
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${themeColors[key as ThemeType]}`}
                  />
                  <span className="text-white text-sm">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThemeSelector
