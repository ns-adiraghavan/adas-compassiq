
interface NavigationDotsProps {
  currentSection: number
  totalSections: number
}

const NavigationDots = ({ currentSection, totalSections }: NavigationDotsProps) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 space-y-3">
      {Array.from({ length: totalSections }, (_, section) => (
        <button
          key={section}
          className={`block w-3 h-3 rounded-full transition-all duration-300 ${
            currentSection === section 
              ? 'bg-white scale-125' 
              : 'bg-white/30 hover:bg-white/50'
          }`}
          onClick={() => {
            const sectionElement = document.querySelectorAll('.section')[section]
            sectionElement?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      ))}
    </div>
  )
}

export default NavigationDots
