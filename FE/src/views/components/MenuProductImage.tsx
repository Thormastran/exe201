'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DEFAULT_MENU_IMAGE, menuImageUrl } from '@/lib/brand';

export function MenuProductImage({
  name,
  imageUrl,
  className = 'h-full w-full object-cover',
  sizes = '160px',
}: {
  name: string;
  imageUrl?: string;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? DEFAULT_MENU_IMAGE : menuImageUrl(name, imageUrl);

  return (
    <Image
      src={src}
      alt={name}
      fill
      sizes={sizes}
      className={className}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
