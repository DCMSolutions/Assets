export default function LoadingTableSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Título */}
      <div className="h-8 w-1/3 bg-gray-300 rounded" />

      {/* Filtros o barra de acciones */}
      <div className="flex space-x-4">
        <div className="h-10 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-10 bg-gray-200 rounded-full" />
      </div>

      {/* Tabla */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 border-r last:border-r-0" />
          ))}
        </div>
        {[...Array(6)].map((_, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-6 border-t border-gray-100">
            {[...Array(6)].map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-8 bg-gray-200 border-r last:border-r-0"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-end space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
