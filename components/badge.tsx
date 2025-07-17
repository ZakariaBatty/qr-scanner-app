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
        backgroundColor: data.event.backgroundColor,
        WebkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}
      className="w-[340px] h-[500px] rounded-lg shadow-lg border border-gray-300 font-sans text-sm bg-white print-colors-exact flex flex-col justify-between"
    >
      {/* === TOP (يمكن تخلّي مكانه فارغ أو تضيف شعار فوق) === */}
      <div className="p-4">
        {/* تقدر تضيف شي معلومات هنا مستقبلاً */}
      </div>

      {/* === FOOTER المحتوى الرئيسي === */}
      <div
        style={{
          color: data.event.foregroundColor,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          WebkitPrintColorAdjust: 'exact',
          colorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
        className="px-4 py-3 text-left flex flex-col gap-2"
      >
        <div className="flex justify-between items-center">
          <Image
            src={data.logo || data.event.logo}
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-md border border-white"
          />
          <div className="flex-1 ml-3">
            <p className="text-base font-bold text-white">{data.name}</p>
            <p className="text-xs uppercase font-medium opacity-80 text-white">{data.type}</p>
          </div>
          <Image
            src={data.qrImageUrl}
            alt="QR Code"
            width={60}
            height={60}
            className="rounded-sm"
          />
        </div>

        {/* Access rooms */}
        {data.ateliers?.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2 text-xs">
              {data.ateliers.map((room, index) => (
                <span
                  key={index}
                  style={{
                    color: data.event.foregroundColor,
                    border: `1px solid ${data.event.backgroundColor}`,
                    backgroundColor: 'white'
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
    </div>

  );
}