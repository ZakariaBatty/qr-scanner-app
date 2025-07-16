"use client"

import { useState, useRef } from "react"
import { Camera, PrinterIcon as Print, RotateCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRScanner from "@/components/qr-scanner"
import Badge from "@/components/badge"

interface InviteData {
  id: string
  name: string
  email: string
  event: string
  type: string
  checkedIn: boolean
  timestamp?: string
}

export default function QRScannerApp() {
  const [result, setResult] = useState<string>("")
  const [inviteData, setInviteData] = useState<InviteData | null>(null)
  const [error, setError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(true)
  const badgeRef = useRef<HTMLDivElement>(null)

  const handleScan = async (data: string | null) => {
    if (data && !inviteData) {
      setResult(data)
      setError("")

      try {
        const res = await fetch("/api/check-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer SCANNER_DEVICE_SECRET",
          },
          body: JSON.stringify({ code: data }),
        })

        if (!res.ok) throw new Error(await res.text())

        const json = await res.json()
        setInviteData(json)
        setIsScanning(false)
      } catch (err: any) {
        setError(err.message || "Error fetching invite data")
      }
    }
  }

  const handlePrint = () => {
    if (badgeRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Badge Print</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: system-ui, -apple-system, sans-serif;
                }
                .badge {
                  max-width: 400px;
                  margin: 0 auto;
                }
                @media print {
                  body { margin: 0; padding: 0; }
                  .badge { 
                    max-width: none; 
                    width: 100%;
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <div class="badge">
                ${badgeRef.current.innerHTML}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const resetScanner = () => {
    setResult("")
    setInviteData(null)
    setError("")
    setIsScanning(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Camera className="h-6 w-6" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isScanning && !inviteData && (
              <div className="space-y-4">
                <QRScanner onScan={handleScan} />
                {result && <div className="text-center text-sm text-muted-foreground">Scanned: {result}</div>}
              </div>
            )}

            {inviteData && (
              <div className="space-y-4">
                <div ref={badgeRef}>
                  <Badge data={inviteData} />
                </div>

                <div className="flex gap-2 justify-center">
                  <Button onClick={handlePrint} className="flex items-center gap-2">
                    <Print className="h-4 w-4" />
                    Print Badge
                  </Button>
                  <Button variant="outline" onClick={resetScanner} className="flex items-center gap-2 bg-transparent">
                    <RotateCcw className="h-4 w-4" />
                    Scan Another
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
