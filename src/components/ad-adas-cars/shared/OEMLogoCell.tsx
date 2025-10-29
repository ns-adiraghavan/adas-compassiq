import { useOEMLogo } from "@/hooks/useOEMLogo"

interface OEMLogoCellProps {
  oemName: string
  showName?: boolean
  className?: string
}

const OEMLogoCell = ({ oemName, showName = true, className = "" }: OEMLogoCellProps) => {
  const { data: logoUrl, isLoading } = useOEMLogo(oemName)

  if (isLoading) {
    return <div className={`text-sm ${className}`}>{showName ? oemName : ""}</div>
  }

  // Special handling for BMW and GM logos
  const getLogoClassName = () => {
    const baseClasses = "w-10 h-10 object-contain flex-shrink-0 opacity-90"
    
    if (oemName === "BMW") {
      // BMW logo: black in light mode, white in dark mode
      return `${baseClasses} brightness-0 dark:invert`
    } else if (oemName === "General Motors" || oemName === "GM") {
      // GM logo: black in light mode, white in dark mode
      return `${baseClasses} brightness-0 dark:invert`
    } else {
      // All other logos: white in dark mode
      return `${baseClasses} dark:brightness-0 dark:invert`
    }
  }

  if (logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src={logoUrl} 
          alt={`${oemName} logo`}
          className={getLogoClassName()}
        />
        {showName && <span className="font-medium">{oemName}</span>}
      </div>
    )
  }

  return <div className={`text-sm ${className}`}>{showName ? oemName : ""}</div>
}

export default OEMLogoCell
