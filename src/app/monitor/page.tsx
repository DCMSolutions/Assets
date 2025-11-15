import LockersCarousel from "~/components/monitor/lockers-carousel";
import { Title } from "~/components/title";
import { api } from "~/trpc/server";

export default async function MonitorPage() {
  const lockers = await api.lockers.getForMonitor.query()

  return (
    <section className="flex-grow">
      <div className="flex pl-4 justify-between">
        <Title>Monitor de lockers</Title>
      </div>
      <div>
        <LockersCarousel lockers={lockers} />
      </div>
    </section>
  );
}
