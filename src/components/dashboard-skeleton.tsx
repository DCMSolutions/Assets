export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-1/3 bg-gray-300 rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );
}
