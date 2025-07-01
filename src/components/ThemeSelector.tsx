
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { Switch } from "@/components/ui/switch"

const ThemeSelector = () => {
  const { currentTheme, setTheme } = useTheme()

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-md">
      <Moon className="h-4 w-4" />
      <Switch
        checked={currentTheme === 'light'}
        onCheckedChange={handleThemeToggle}
        className="data-[state=checked]:bg-white data-[state=unchecked]:bg-slate-600"
      />
      <Sun className="h-4 w-4" />
    </div>
  )
}

export default ThemeSelector
