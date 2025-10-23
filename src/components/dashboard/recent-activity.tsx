export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Actividad reciente</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">Fecha</th>
              <th>Creado por</th>
              <th>Acción</th>
              <th>Activo</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapea tus datos aquí */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
