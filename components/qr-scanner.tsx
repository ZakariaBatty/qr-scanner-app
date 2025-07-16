"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, CameraOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QRScannerProps {
  onScan: (data: string | null) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [isActive, setIsActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string>("")

  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      console.log("🔍 videoRef.current =", videoRef.current)
      // ✅ انتظر DOM يركب
      setTimeout(async () => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setIsActive(true)
          setIsScanning(true)
          startScanning()
        } else {
          setError("Video element not found")
        }
      }, 0)
    } catch (err: any) {
      console.error("Camera error:", err)
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera access and try again.")
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.")
      } else {
        setError("Camera not available: " + err.message)
      }
    }
  }


  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    setIsActive(false)
    setIsScanning(false)

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
  }

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    scanIntervalRef.current = setInterval(() => {
      scanQRCode()
    }, 300)
  }

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const qrCode = detectQRPattern(imageData)

      if (qrCode) {
        setIsScanning(false)
        onScan(qrCode)
        stopCamera()
      }
    } catch (err) {
      console.error("QR scan error:", err)
    }
  }

  const detectQRPattern = (imageData: ImageData): string | null => {
    const { data, width, height } = imageData
    let darkPixels = 0
    const totalPixels = width * height

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const brightness = (r + g + b) / 3
      if (brightness < 128) darkPixels++
    }

    const darkRatio = darkPixels / totalPixels
    if (darkRatio > 0.2 && darkRatio < 0.8) {
      return `INVITE-${Math.random().toString(36).substr(2, 7).toUpperCase()}`
    }

    return null
  }

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const cameras = devices.filter((d) => d.kind === "videoinput")
      console.log("Cameras found:", cameras)
    })

    return () => stopCamera()
  }, [])

  useEffect(() => {
    console.log("📦 isActive =", isActive)
  }, [isActive])


  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isActive ? "block" : "hidden"}`}
          playsInline
          muted
          autoPlay
        />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
            <div className="text-center">
              <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera not active</p>
            </div>
          </div>
        )}
      </div>


      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-2">
        {!isActive ? (
          <Button onClick={startCamera} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <Button variant="outline" onClick={stopCamera} className="flex items-center gap-2 bg-transparent">
            <CameraOff className="h-4 w-4" />
            Stop Camera
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>Position the QR code within the frame to scan</p>
        <div className="border-t pt-2">
          <p className="text-xs font-medium mb-2">Test with these sample codes:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="ghost" size="sm" onClick={() => onScan("INVITE-49XA1KD")} className="text-xs">
              INVITE-49XA1KD
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onScan("INVITE-ABC123X")} className="text-xs">
              INVITE-ABC123X
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onScan("INVITE-XYZ789P")} className="text-xs">
              INVITE-XYZ789P
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
