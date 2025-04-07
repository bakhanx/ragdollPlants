import { ReactNode } from 'react';
import Link from 'next/link';

type CardProps = {
  children: ReactNode;
  href?: string;
  className?: string;
};

export default function Card({ children, href, className = '' }: CardProps) {
  const baseClasses = 'rounded-xl border border-green-100 bg-white/50 transition-colors hover:bg-white/70';
  const combinedClasses = `${baseClasses} ${className}`;

  if (href) {
    return (
      <Link href={href}>
        <div className={combinedClasses}>{children}</div>
      </Link>
    );
  }

  return <div className={combinedClasses}>{children}</div>;
} 