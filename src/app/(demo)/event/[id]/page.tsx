import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarIcon, MapPinIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { TicketSelector } from "@/components/TicketSelector";
import eventsData from "@/const/data.json";

async function getEventById(id: string) {
  // In a real app, this would be a DB or API call
  const event = eventsData.events.find((event) => event.id === id);
  if (!event) return null;
  return event;
}

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src={event.headerImage}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-8 left-8">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-white bg-[#099C77] rounded-full">
            {event.type}
          </span>
          <h1 className="text-4xl font-bold text-white">{event.name}</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-[#099C77]" />
                  <span>
                    {format(new Date(event.dateTime), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#099C77]" />
                  <span>
                    {format(new Date(event.dateTime), "h:mm a")} -{" "}
                    {format(new Date(event.endDateTime), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#099C77]" />
                  <span>
                    {event.location.venue}, {event.location.city},{" "}
                    {event.location.country}
                  </span>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
              <p className="text-gray-600">{event.organizer.description}</p>
            </section>

            {/* Organizer Section */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={event.organizer.logo}
                    alt={event.organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{event.organizer.name}</h3>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
            </section>
          </div>

          {/* Ticket Selection Sidebar */}
          <div className="lg:col-span-1">
            <TicketSelector event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
