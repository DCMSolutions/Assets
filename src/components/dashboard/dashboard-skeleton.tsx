"use client";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen animate-in fade-in duration-300">
      {/* Título */}
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />

      {/* Tarjetas superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl shadow-sm flex flex-col items-center gap-2 animate-pulse"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Secciones inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de actividad */}
        <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
          <div className="h-6 w-40 mb-4 bg-gray-200 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 border-b border-gray-100 py-2"
              >
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center animate-pulse">
          <div className="h-6 w-48 mb-4 bg-gray-200 rounded" />
          <div className="h-48 w-48 rounded-full bg-gray-200" />
          <div className="flex justify-center gap-3 mt-4">
            {["LOCKER", "USUARIO", "REPARACIÓN", "EOL"].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-200" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
