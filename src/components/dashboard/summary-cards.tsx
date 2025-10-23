import { api } from "~/trpc/server"

export default async function SummaryCards() {
  const assets = await api.assets.getAll.query()
  const employees = await api.employees.getAll.query()
  let assetsInLocker = 0
  let assetsWithEmployee = 0
  let assetsUnderMaintenance = 0

  assets.forEach(asset => {
    if (asset.idBoxAsignado && !asset.poseedorActual) assetsInLocker++
    if (asset.poseedorActual) assetsWithEmployee++
    if (asset.estado === 2) assetsUnderMaintenance++
  })
  const cards = [
    { title: "Activos", value: assets.length, color: "bg-[#39CCCC]", link: "/assets" },
    { title: "En el locker", value: assetsInLocker, color: "bg-[#D81B60]", link: "/assets" },
    { title: "En usuarios", value: assetsWithEmployee, color: "bg-[#FF851B]", link: "/assets" },
    { title: "En reparación", value: assetsUnderMaintenance, color: "bg-[#605CA8]", link: "/assets" },
    { title: "Usuarios", value: employees.length, color: "bg-[#3C8DBC]", link: "/employees" },
  ];

  return (
    <div className="flex md:flex-wrap p-4 justify-between">
      {cards.map((card) => (
        <a href={card.link} >
          <div
            key={card.title}
            className={`${card.color} group text-white h-32 w-48 rounded-lg p-2 flex shadow-md transition-transform duration-300 hover:scale-105`}
          >
            <div className="space-x-1 flex flex-col grow items-center">
              <div className="text-6xl font-bold">{card.value}</div>
              <div className="text-xl">{card.title}</div>
              <button className="text-xs mt-2 opacity-80 group-hover:opacity-100 group-hover:font-bold">
                Haga clic para ver
              </button>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
