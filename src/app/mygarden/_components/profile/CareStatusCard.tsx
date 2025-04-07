import { ReactNode } from 'react';
import Card from '@/app/_components/common/Card';

type CareStatusCardProps = {
  icon: ReactNode;
  iconColor: string;
  title: string;
  count: number;
  href: string;
  textColor: string;
};

export default function CareStatusCard({
  icon,
  iconColor,
  title,
  count,
  href,
  textColor
}: CareStatusCardProps) {
  return (
    <Card
      href={href}
      className="p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`[&>svg]:size-4 ${iconColor}`}>{icon}</div>
        <span className="truncate text-sm font-medium text-gray-700">
          {title}
        </span>
      </div>
      <p className="text-xs text-gray-600 sm:text-sm">
        {title} <span className={`font-bold ${textColor}`}>{count}</span>개
      </p>
    </Card>
  );
} 