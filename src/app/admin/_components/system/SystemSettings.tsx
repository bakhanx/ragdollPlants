import RefreshButton from '../common/RefreshButton';

export default function SystemSettings() {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">시스템 설정</h3>
        <RefreshButton />
        <p className="text-sm text-gray-500">
          시스템 설정 기능이 곧 구현됩니다.
        </p>
      </div>
    </div>
  );
}
