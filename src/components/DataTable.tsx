
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const sampleTableData = [
  { feature: "Adaptive Cruise Control", oem: "BMW", country: "Germany", availability: "Available" },
  { feature: "Lane Keep Assist", oem: "Mercedes", country: "USA", availability: "Available" },
  { feature: "Parking Assist", oem: "Audi", country: "UK", availability: "Limited" },
  { feature: "Traffic Sign Recognition", oem: "Tesla", country: "China", availability: "Available" },
  { feature: "Emergency Braking", oem: "Toyota", country: "Japan", availability: "Standard" },
]

export function DataTable() {
  return (
    <Card className="hover-lift animate-slide-in-right bg-gradient-to-br from-card/50 to-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground">Feature Availability Overview</CardTitle>
        <CardDescription className="text-muted-foreground">Recent feature availability across OEMs and regions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50 transition-colors duration-200">
              <TableHead className="text-muted-foreground font-semibold">Feature</TableHead>
              <TableHead className="text-muted-foreground font-semibold">OEM</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Country</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTableData.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-border hover:bg-muted/30 transition-all duration-200 hover:translate-x-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TableCell className="font-medium text-foreground">{row.feature}</TableCell>
                <TableCell className="text-muted-foreground">{row.oem}</TableCell>
                <TableCell className="text-muted-foreground">{row.country}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    row.availability === 'Available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    row.availability === 'Limited' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {row.availability}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
