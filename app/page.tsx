"use client"

import { useState, useRef } from "react"
import { Camera, PrinterIcon as Print, RotateCcw, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import QRScanner from "@/components/qr-scanner"
import Badge from "@/components/badge"

interface InviteData {
  data: {
    id: string
    name: string
    email?: string
    logo: string | null
    type: string
    status: string
    ticketNumber: string
    qrImageUrl: string
    event: {
      id: string
      title: string
      logo: string
      coverImage: string
      backgroundColor: string
      foregroundColor: string
    }
    ateliers: {
      title: string
      location: string
      startDate: string
      endDate: string
    }[]
  }
}

export default function QRScannerApp() {
  const [result, setResult] = useState<string>("")
  const [inviteData, setInviteData] = useState<InviteData["data"] | null>(null)
  const [error, setError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(true)
  const badgeRef = useRef<HTMLDivElement>(null)

  const handleScan = async (data: string | null) => {
    if (data && !inviteData) {
      setResult(data)
      setError("")

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/invite/check-in`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fakePayload.signedPart`,
          },
          body: JSON.stringify({ code: data }),
        })

        if (!res.ok) throw new Error(await res.text())

        const json = await res.json()
        setInviteData(json)
        setIsScanning(false)
      } catch (err: any) {
        console.log("dd", err)
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
              <title>Print Badge</title>
              <style>
                @page {
                  size: 9cm 13cm;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .badge-container {
                  width: 9cm;
                  height: 13cm;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                  background: white;
                }
                .badge-content {
                  transform: scale(0.95);
                  transform-origin: center;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                img {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              </style>
            </head>
            <body>
              <div class="badge-container">
                <div class="badge-content">
                  ${badgeRef.current.innerHTML}
                </div>
              </div>
            </body>
          </html>
        `);

        printWindow.document.close()
        printWindow.focus()

        // إضافة تأخير قصير للتأكد من تحميل الصور
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }

  const handleSaveAsPDF = () => {
    if (badgeRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Badge - ${inviteData?.name || 'Badge'}</title>
              <style>
                @page {
                  size: 9cm 13cm;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .badge-container {
                  width: 9cm;
                  height: 13cm;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                  background: white;
                }
                .badge-content {
                  transform: scale(0.95);
                  transform-origin: center;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              </style>
            </head>
            <body>
              <div class="badge-container">
                <div class="badge-content">
                  ${badgeRef.current.innerHTML}
                </div>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                  }, 1000);
                }
              </script>
            </body>
          </html>
        `);

        printWindow.document.close()
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
          <CardContent className="space-y-4 flex justify-center">
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
              <div className="space-y-4 mx-auto">
                <div ref={badgeRef}>
                  <Badge data={inviteData} />
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  <Button onClick={handlePrint} className="flex items-center gap-2">
                    <Print className="h-4 w-4" />
                    Print Badge
                  </Button>
                  {/* <Button
                    onClick={handleSaveAsPDF}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Print Badge
                  </Button> */}
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