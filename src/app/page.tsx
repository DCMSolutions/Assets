import AssetLocationChart from "~/components/dashboard/assets-pie-chart";
import RecentActivity from "~/components/dashboard/recent-activity";
import SummaryCards from "~/components/dashboard/summary-cards";
import { api } from "~/trpc/server";

export default async function Page() {

  const assets = await api.assets.getAll.query()
  const employees = await api.employees.getAll.query()
  let assetsInLocker = { value: 0, color: "#D81B60" }
  let assetsWithEmployee = { value: 0, color: "#FF851B" }
  let assetsUnderMaintenance = { value: 0, color: "#605CA8" }
  let assetsEOL = { value: 0, color: "#A5A5A5" }

  assets.forEach(asset => {
    if (asset.idBoxAsignado && !asset.poseedorActual) assetsInLocker.value++
    if (asset.poseedorActual) assetsWithEmployee.value++
    if (asset.estado === 2) assetsUnderMaintenance.value++
    if (asset.estado === 4) assetsEOL.value++
  })

  const cards = [
    { title: "Activos", value: assets.length, color: "bg-[#39CCCC]", link: "/assets" },
    { title: "En el locker", value: assetsInLocker.value, color: `bg-[${assetsInLocker.color}]`, link: "/assets" },
    { title: "En usuarios", value: assetsWithEmployee.value, color: `bg-[${assetsWithEmployee.color}]`, link: "/assets" },
    { title: "En reparación", value: assetsUnderMaintenance.value, color: `bg-[${assetsUnderMaintenance.color}]`, link: "/assets" },
    { title: "Usuarios", value: employees.length, color: "bg-[#3C8DBC]", link: "/employees" },
  ]

  const data = [
    { name: "LOCKER", value: assetsInLocker.value, color: assetsInLocker.color },
    { name: "USUARIO", value: assetsWithEmployee.value, color: assetsWithEmployee.color },
    { name: "REPARACIÓN", value: assetsUnderMaintenance.value, color: assetsUnderMaintenance.color },
    { name: "EOL", value: assetsEOL.value, color: assetsEOL.color },
  ];

  return (
    <section className="p-4 ">
      <h1 className="text-3xl font-semibold">Panel principal</h1>
      <SummaryCards cards={cards} />
      <div className="grid grid-rows-2 grid-cols-3 gap-4 mt-6">
        <div className="col-span-2" >
          <RecentActivity />
        </div>
        <div>
          <AssetLocationChart data={data} />
        </div>
      </div>
    </section >
  );
}
