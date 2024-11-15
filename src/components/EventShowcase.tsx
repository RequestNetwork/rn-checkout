"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useMemo } from "react";

interface Event {
  id: string;
  name: string;
  type: string;
  image: string;
  dateTime: string;
  location: {
    city: string;
    country: string;
  };
  startingPrice: number;
}

interface EventShowcaseProps {
  events: Event[];
}

export const EventShowcase = ({ events }: EventShowcaseProps) => {
  const [activeTab, setActiveTab] = useState("all");

  // Get unique event types and add "All" option
  const eventTypes = useMemo(() => {
    const types = ["All", ...new Set(events.map((event) => event.type))];
    return types;
  }, [events]);

  // Filter events based on active tab
  const filteredEvents = useMemo(() => {
    if (activeTab.toLowerCase() === "all") return events;
    return events.filter(
      (event) => event.type.toLowerCase() === activeTab.toLowerCase()
    );
  }, [events, activeTab]);

  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab}>
      <TabsList
        className="w-fit justify-start overflow-x-auto"
        aria-label="Event Categories"
      >
        {eventTypes.map((type) => (
          <TabsTrigger
            key={type}
            value={type.toLowerCase()}
            aria-label={`Show ${type} events`}
          >
            {type}
          </TabsTrigger>
        ))}
      </TabsList>

      {eventTypes.map((type) => (
        <TabsContent key={type} value={type.toLowerCase()}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                href={`/event/${event.id}`}
                key={event.id}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                aria-label={`View details for ${event.name} on ${format(new Date(event.dateTime), "MMM d, yyyy")}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-[#099C77] px-3 py-1 text-sm font-medium text-white shadow-sm">
                      {event.type}
                    </span>
                  </div>
                </div>

                <div className="flex h-full flex-col justify-between p-5">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-[#099C77]">
                      {event.name}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-[#099C77]" />
                        <span>
                          {format(
                            new Date(event.dateTime),
                            "MMM d, yyyy • h:mm a"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-[#099C77]" />
                        <span>{`${event.location.city}, ${event.location.country}`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-medium">
                      <span className="text-sm text-gray-500">From </span>
                      <span className="text-lg text-[#099C77]">
                        ${event.startingPrice}
                      </span>
                    </div>
                    <span className="rounded-lg bg-[#099C77]/10 px-3 py-1 text-sm font-medium text-[#099C77]">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
