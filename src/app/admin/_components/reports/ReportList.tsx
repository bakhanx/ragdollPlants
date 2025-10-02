interface ReportListProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ReportList({ searchParams }: ReportListProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">신고 목록</h3>
        <p className="text-sm text-gray-500">신고 목록 기능이 곧 구현됩니다.</p>
      </div>
    </div>
  );
}
