'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { Modal } from '@/views/components/Modal';

export function UpgradeModal({
  open,
  daysLeft,
  onClose,
}: {
  open: boolean;
  daysLeft: number;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="rounded-2xl bg-white p-6 shadow-xl">
      <h2 className="text-lg font-bold text-stone-900">Sắp hết dùng thử</h2>
      <p className="mt-2 text-sm text-stone-600">
        {daysLeft <= 1
          ? 'Trial Premium của bạn còn 1 ngày. Gia hạn ngay để không gián đoạn bán hàng.'
          : `Trial Premium còn ${daysLeft} ngày. Nâng cấp sớm để tiếp tục dùng đầy đủ tính năng.`}
      </p>
      <div className="mt-4 flex gap-2">
        <Link
          href="/dashboard/admin/billing"
          onClick={onClose}
          className={`flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white ${BRAND.primary}`}
        >
          Xem gói & thanh toán
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-4 py-2.5 text-sm"
        >
          Để sau
        </button>
      </div>
      </div>
    </Modal>
  );
}
