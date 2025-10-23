import AssetLocationChart from "~/components/dashboard/assets-pie-chart";
import RecentActivity from "~/components/dashboard/recent-activity";
import SummaryCards from "~/components/dashboard/summary-cards";
import { api } from "~/trpc/server";

export default async function Page() {

  return (
    <section className="p-4">
      <h1 className="text-3xl font-semibold">Panel principal</h1>
      <SummaryCards />
    </section >
  );
}
