import { ReactNode } from 'react';
import Link from 'next/link';

type CardProps = {
  children: ReactNode;
  href?: string;
  isHover?: boolean;
  className?: string;
};

export const Card = ({
  children,
  href,
  isHover = true,
  className = ''
}: CardProps) => {
  const baseClasses = `rounded-xl border border-green-100 bg-white/50 transition-colors ${isHover ? 'hover:bg-white/70' : ''}`;
  const combinedClasses = `${baseClasses} ${className}`;

  if (href) {
    return (
      <Link href={href}>
        <div className={combinedClasses}>{children}</div>
      </Link>
    );
  }

  return <div className={combinedClasses}>{children}</div>;
};
