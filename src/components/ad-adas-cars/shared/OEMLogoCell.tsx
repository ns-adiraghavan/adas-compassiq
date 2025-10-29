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

  if (logoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img 
          src={logoUrl} 
          alt={`${oemName} logo`}
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        {showName && <span className="font-medium">{oemName}</span>}
      </div>
    )
  }

  return <div className={`text-sm ${className}`}>{showName ? oemName : ""}</div>
}

export default OEMLogoCell
