"use client"

import { useState, useRef } from "react"
import { Camera, PrinterIcon as Print, RotateCcw, AlertCircle } from "lucide-react"
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
    badge: {
      id: string
      name: string
      mockupImageUrl: string
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
        console.log(json)
        setInviteData(json)
        setIsScanning(false)
      } catch (err: any) {
        console.log("dd", err)
        setError(err.message || "Error fetching invite data")
      }
    }
  }

  const handlePrint = () => {
    if (!inviteData) return;

    const {
      name,
      type,
      qrImageUrl,
      logo,
      event,
      ateliers,
    } = inviteData;

    const roomsHtml = ateliers?.map(
      (room) => `
    <span style="
      padding: 4px 8px;
      border-radius: 9999px;
      font-size: 12px;
      background: white;
      color: ${event.foregroundColor};
      border: 1px solid ${event.backgroundColor};
      display: inline-block;
      margin: 2px;
    ">
      ${room.title}
    </span>
  `
    ).join("") || "";

    // إنشاء iframe مخفي
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
      <html>
        <head>
          <title>Print Badge</title>
          <style>
            @page { 
              size: 10cm 14cm;
              margin: 0.5cm; 
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              print-color-adjust: exact;
              font-family: Arial, sans-serif;
              width: 9cm;
              height: 13cm;
            }
            .badge {
              width: 9cm;
              height: 13cm;
              background: url('${event.coverImage}') center center / cover no-repeat;
              background-color: ${event.backgroundColor};
              border-radius: 10px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              overflow: hidden;
              color: ${event.foregroundColor};
              box-sizing: border-box;
            }
            .footer {
              background: rgba(0, 0, 0, 0.6);
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .top-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .avatar {
              width: 60px;
              height: 60px;
              border-radius: 8px;
              border: 2px solid white;
              object-fit: cover;
            }
            .qr {
              width: 60px;
              height: 60px;
            }
            .name-type {
              flex: 1;
              margin-left: 12px;
            }
            .name {
              font-size: 16px;
              font-weight: bold;
              color: white;
            }
            .type {
              font-size: 10px;
              text-transform: uppercase;
              color: white;
              opacity: 0.8;
            }
            .rooms {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
            }
          </style>
        </head>
        <body>
          <div class="badge">
            <div class="footer">
              <div class="top-row">
                <img src="${logo || event.logo}" class="avatar" />
                <div class="name-type">
                  <div class="name">${name}</div>
                  <div class="type">${type}</div>
                </div>
                <img src="${qrImageUrl}" class="qr" />
              </div>
              <div class="rooms">${roomsHtml}</div>
            </div>
          </div>
        </body>
      </html>
    `);
      doc.close();

      // انتظار تحميل الصور ثم طباعة
      setTimeout(() => {
        iframe.contentWindow?.print();

        // حذف الـ iframe بعد الطباعة
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 1000);
    }
  };


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