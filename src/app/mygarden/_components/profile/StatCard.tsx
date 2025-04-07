import Card from '@/app/_components/common/Card';

type StatCardProps = {
  value: number;
  label: string;
  href: string;
};

export default function StatCard({ value, label, href }: StatCardProps) {
  return (
    <Card href={href} className="px-1.5 py-2">
      <div className="flex flex-col items-center">
        <span className="mb-1 text-base leading-none font-bold text-green-700 sm:text-lg">
          {value}
        </span>
        <span className="text-xs whitespace-nowrap text-gray-600">
          {label}
        </span>
      </div>
    </Card>
  );
} 