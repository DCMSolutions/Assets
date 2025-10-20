export default function LoadingFormSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse max-w-2xl">
      {/* Título */}
      <div className="h-8 w-1/3 bg-gray-300 rounded" />

      {/* Campos del formulario */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ))}

      {/* Botones */}
      <div className="flex space-x-4 pt-4">
        <div className="h-10 w-24 bg-gray-300 rounded" />
        <div className="h-10 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

