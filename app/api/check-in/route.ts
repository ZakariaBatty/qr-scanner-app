import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const mockInvites = {
  "INVITE-49XA1KD": {
    id: "INVITE-49XA1KD",
    name: "John Doe",
    email: "john.doe@example.com",
    event: "Tech Conference 2024",
    type: "VIP",
    checkedIn: false,
  },
  "INVITE-ABC123X": {
    id: "INVITE-ABC123X",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    event: "Tech Conference 2024",
    type: "General",
    checkedIn: true,
  },
  "INVITE-XYZ789P": {
    id: "INVITE-XYZ789P",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    event: "Tech Conference 2024",
    type: "Speaker",
    checkedIn: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get("authorization")
    if (authHeader !== "Bearer SCANNER_DEVICE_SECRET") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    // Look up invite in mock database
    const invite = mockInvites[code as keyof typeof mockInvites]

    if (!invite) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 })
    }

    // Mark as checked in and add timestamp
    const updatedInvite = {
      ...invite,
      checkedIn: true,
      timestamp: new Date().toISOString(),
    }

    // Update mock database
    mockInvites[code as keyof typeof mockInvites] = updatedInvite

    return NextResponse.json(updatedInvite)
  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
