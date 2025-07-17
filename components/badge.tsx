import Image from "next/image";

interface InviteData {
  data: {
    id: string
    name: string
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
      startDate: string
      endDate: string
    }[]
  }
}

export default function EventBadge({ data }: InviteData) {
  return (
    <div
      style={{
        background: `url(${data.event.coverImage}) center center / cover no-repeat`,
        backgroundColor: data.event.backgroundColor, // fallback color
        WebkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
      className="relative w-[340px] h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-300 font-sans text-sm bg-white print-colors-exact"
    >
      {/* === FIXED FOOTER === */}
      <div
        style={{
          color: data.event.foregroundColor,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          WebkitPrintColorAdjust: 'exact',
          colorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
        className="absolute bottom-0 w-full px-4 py-3 text-left flex flex-col gap-2"
      >
        {/* Top part: image + name + QR */}
        <div className="flex justify-between items-center">
          {/* Avatar */}
          <Image
            src={data.logo || data.event.logo}
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-md border border-white"
            style={{
              WebkitPrintColorAdjust: 'exact',
              colorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}
          />

          {/* Name and type */}
          <div className="flex-1 ml-3">
            <p
              className="text-base font-bold"
              style={{
                color: "white",
                WebkitPrintColorAdjust: 'exact',
                colorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              {data.name}
            </p>
            <p
              className="text-xs uppercase font-medium opacity-80"
              style={{
                color: "white",
                WebkitPrintColorAdjust: 'exact',
                colorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              {data.type}
            </p>
          </div>

          {/* QR Code */}
          <Image
            src={data.qrImageUrl}
            alt="QR Code"
            width={60}
            height={60}
            className="rounded-sm"
            style={{
              WebkitPrintColorAdjust: 'exact',
              colorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}
          />
        </div>

        {/* Access Rooms */}
        {data.ateliers && data.ateliers.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2 text-xs">
              {data.ateliers.map((room, index) => (
                <span
                  key={index}
                  style={{
                    color: data.event.foregroundColor,
                    border: `1px solid ${data.event.backgroundColor}`,
                    backgroundColor: 'white',
                    WebkitPrintColorAdjust: 'exact',
                    colorAdjust: 'exact',
                    printColorAdjust: 'exact'
                  }}
                  className="px-2 py-1 rounded-full"
                >
                  {room.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for print styles */}
      <style jsx>{`
        @media print {
          .print-colors-exact {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}