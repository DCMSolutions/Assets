import { api } from "~/trpc/server";
import { HistoryDataTable } from "./history-table";
import { historyTableColumns } from "./history-columns";

export default async function RecentActivity() {
  const history = await api.assets.history.query()
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Actividad reciente</h2>

      <HistoryDataTable data={history} columns={historyTableColumns} />
    </div>
  );
}
