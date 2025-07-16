"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { CheckCircle, Clock, User, Mail, Calendar } from "lucide-react"

interface BadgeProps {
  data: {
    id: string
    name: string
    email: string
    event: string
    type: string
    checkedIn: boolean
    timestamp?: string
  }
}

export default function Badge({ data }: BadgeProps) {
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return new Date().toLocaleString()
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center border-b border-blue-200 pb-4">
          <h2 className="text-2xl font-bold text-blue-900">{data.event}</h2>
          <p className="text-sm text-blue-600">Event Badge</p>
        </div>

        {/* Attendee Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-lg text-gray-900">{data.name}</p>
              <p className="text-sm text-gray-600">{data.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Invite ID</p>
              <p className="text-sm text-gray-600 font-mono">{data.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Ticket Type</p>
              <BadgeUI variant="secondary" className="text-xs">
                {data.type}
              </BadgeUI>
            </div>
          </div>
        </div>

        {/* Check-in Status */}
        <div className="border-t border-blue-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {data.checkedIn ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Checked In</span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Pending Check-in</span>
                </>
              )}
            </div>
            <BadgeUI
              variant={data.checkedIn ? "default" : "secondary"}
              className={data.checkedIn ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
            >
              {data.checkedIn ? "ADMITTED" : "VERIFY"}
            </BadgeUI>
          </div>

          <div className="mt-2 text-xs text-gray-500">Scanned: {formatTimestamp(data.timestamp)}</div>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center pt-2">
          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">QR</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
