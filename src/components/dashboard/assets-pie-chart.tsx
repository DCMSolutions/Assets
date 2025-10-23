import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

export default function AssetLocationChart() {
  const data = [
    { name: "STOCK", value: 30 },
    { name: "LOCKER", value: 23 },
    { name: "USUARIO", value: 34 },
    { name: "REPARACIÓN", value: 4 },
    { name: "EOL", value: 5 },
  ];

  const COLORS = ["#2563EB", "#F97316", "#9CA3AF", "#F59E0B", "#3B82F6"];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Ubicación de los activos</h2>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
