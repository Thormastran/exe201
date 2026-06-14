import Image from 'next/image';
import { BRAND, BRAND_LOGO } from '@/lib/brand';

export function BrandLogo({
  size = 36,
  showName = true,
  className = '',
}: {
  size?: number;
  showName?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={BRAND_LOGO}
        alt="BOBAPOS"
        width={size}
        height={size}
        className="rounded-xl object-cover shadow-md ring-1 ring-stone-200/80"
        priority
      />
      {showName && (
        <span className={`text-xl font-bold tracking-tight ${BRAND.primaryText}`}>BOBAPOS</span>
      )}
    </span>
  );
}
