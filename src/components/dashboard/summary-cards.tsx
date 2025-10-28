
interface Card {
  title: string,
  value: number,
  color: string,
  link: string
}

export default async function SummaryCards(
  { cards }: { cards: Card[] }
) {
  return (
    <div className="flex md:flex-wrap p-4 justify-between">
      {cards?.map((card) => (
        <a href={card.link} >
          <div
            key={card.title}
            className="group text-white h-32 w-48 rounded-lg p-2 flex shadow-md transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: card.color }}
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
