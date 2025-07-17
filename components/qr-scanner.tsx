// ✅ QRScanner.tsx - Updated version (Step 1/5)
"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, CameraOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (data: string | null) => void
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string>("")

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsActive(true)
      }
    } catch (err: any) {
      setError("Camera access error: " + err.message)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsActive(false)
  }

  const scan = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !video.videoWidth) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code?.data) {
      stopCamera()
      onScan(code.data)

    } else {
      requestAnimationFrame(scan)
    }
  }

  useEffect(() => {
    if (isActive) {
      requestAnimationFrame(scan)
    }
  }, [isActive])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline autoPlay />
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
      {error && <p className="text-red-600 text-sm">{error}</p>}
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
      </div>
    </div>
  )
}
