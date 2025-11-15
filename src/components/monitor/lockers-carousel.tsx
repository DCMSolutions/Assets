import { Locker } from "~/server/api/routers/lockers";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import { Zap, ZapOff } from "lucide-react";
import { Card, CardTitle } from "~/components/ui/card";
import { BoxesTable } from "./boxes-table";
import { monitorTableColumns } from "./columns";

interface LockersCarouselProps {
  lockers: Locker[]
}

export default function LockersCarousel({
  lockers
}: LockersCarouselProps
) {

  return (
    <section className="flex-grow">
      <Carousel className="ml-10 mr-10">
        <CarouselPrevious />
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
                    columns={monitorTableColumns}
                  />
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext />
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
