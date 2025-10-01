import { Card } from '@/app/_components/common/Card';

type CountStatCardProps = {
  value: number;
  label: string;
  href: string;
};

export default function CountStatCard({
  value,
  label,
  href
}: CountStatCardProps) {
  return (
    <Card
      href={href}
      className="px-1.5 sm:py-2 py-1">
      <div className="flex flex-col items-center">
        <span className="mb-1 leading-none font-bold text-green-700 sm:text-lg text-sm">
          {value || 0}
        </span>
        <span className="sm:text-xs text-[10px] whitespace-nowrap text-gray-600">{label}</span>
      </div>
    </Card>
  );
}
