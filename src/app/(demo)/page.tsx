import { EventShowcase } from "@/components/EventShowcase";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import eventData from "@/const/data.json";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Request Checkout Demo",
  description:
    "This is a demo of the Request Checkout widget. It is a pre-built component that abstracts all the complexities of blockchain transactions using Request Network, making it simple for businesses to handle crypto-to-crypto payments without deep technical knowledge",
};

export default function DemoPage() {
  const events = eventData.events;
  const featuredEvents = events.filter((event) => event.featured);

  return (
    <>
      <section className="flex flex-col gap-2">
        {/* Featured Events Carousel */}
        <div className="mb-8">
          <Carousel
            className="w-full"
            autoplay
            aria-label="Featured Events Slideshow"
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    aria-label={`View details for ${event.name}`}
                  >
                    <div className="relative aspect-[3/1] w-full overflow-hidden rounded-lg">
                      <Image
                        src={event.headerImage}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-white/20 rounded-full">
                            {event.type}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold">{event.name}</h2>
                        <p className="text-sm text-white/80">Featured Event</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <EventShowcase events={events} />
      </section>
    </>
  );
}
