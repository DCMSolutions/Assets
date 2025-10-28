"use client"

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface DataProp {
  name: string,
  value: number,
  color: string
}

export default function AssetLocationChart(
  { data }: { data: DataProp[] }
) {

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
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
