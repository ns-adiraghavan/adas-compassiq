
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
    <Card>
      <CardHeader>
        <CardTitle>Feature Availability Overview</CardTitle>
        <CardDescription>Recent feature availability across OEMs and regions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>OEM</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.feature}</TableCell>
                <TableCell>{row.oem}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    row.availability === 'Available' ? 'bg-green-100 text-green-800' :
                    row.availability === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
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
