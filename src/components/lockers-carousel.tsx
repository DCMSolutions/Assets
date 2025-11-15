import { Locker } from "~/server/api/routers/lockers";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Zap, ZapOff } from "lucide-react";
import { Card, CardTitle } from "./ui/card";

interface LockersCarouselProps {
  lockers: Locker[]
}

export default function LockersCarousel({
  lockers
}: LockersCarouselProps
) {

  return (
    <section className="flex-grow">
      <Carousel className="w-full">
        <CarouselContent>
          {lockers.map((locker) => {
            return (
              <CarouselItem key={locker.nroSerieLocker}>
                <Card>
                  <CardTitle>
                    <Header lockerSerial={locker.nroSerieLocker} status={locker.status} />
                  </CardTitle>
                  <BoxesTable
                    boxes={locker.boxes}
                  />
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function Header({ lockerSerial, status }: { lockerSerial: string, status: string }) {
  return (
    <div className="flex justify-between p-3">
      <div className="flex gap-4">
        <span>Locker: {lockerSerial}</span>
        {status === "connected" ? (
          <Zap size={18} color="green" />
        ) : (
          <ZapOff size={18} color="red" />
        )}
      </div>
    </div>
  );
}
