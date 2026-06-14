'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MenuController,
  OrderController,
  PaymentMethodController,
} from '@/controllers/order.controller';
import { AuthController } from '@/controllers/auth.controller';
import { getStoredUser } from '@/lib/auth-storage';
import { canAccessRole, isStoreOwner } from '@/lib/role-access';
import {
  buildCartLine,
  cartSubtotal,
  findMatchingLine,
} from '@/lib/cart';
import { formatCurrency } from '@/lib/format';
import {
  clearStaffSession,
  resolveStaffSession,
} from '@/lib/staff-session-storage';
import { CartItem, MenuItem, Topping } from '@/models/menu.model';
import { Order } from '@/models/order.model';
import { PaymentOption } from '@/views/staff/CheckoutModal';
import {
  WORK_ROLE_LABELS,
  WORK_SHIFT_LABELS,
  WorkRole,
} from '@/models/staff.model';
import { BRAND } from '@/lib/brand';
import { Role, User } from '@/models/user.model';
import { StaffLayout } from '@/views/staff/StaffLayout';
import { InvoicePreview } from '@/views/staff/InvoicePreview';
import { CashierMenuStep } from '@/views/staff/CashierMenuStep';
import { ToppingModal } from '@/views/staff/ToppingModal';
import { CheckoutModal } from '@/views/staff/CheckoutModal';

type CashierStep = 'menu' | 'invoice' | 'confirm';

const STEPS: { key: CashierStep; label: string }[] = [
  { key: 'menu', label: 'Chọn món' },
  { key: 'invoice', label: 'Hóa đơn' },
  { key: 'confirm', label: 'Hoàn tất' },
];

function cartToOrderItems(cart: CartItem[]) {
  return cart.map((c) => ({
    menuItemId: c.menuItemId,
    name: c.name,
    basePrice: c.basePrice,
    toppings: c.toppings,
    price: c.price,
    quantity: c.quantity,
    note: c.note,
  }));
}

export function CashierView() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session] = useState(() => resolveStaffSession(WorkRole.CASHIER));
  const [step, setStep] = useState<CashierStep>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const [toppingItem, setToppingItem] = useState<MenuItem | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentOption[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentLabel, setPaymentLabel] = useState('');

  useEffect(() => {
    const stored = getStoredUser<User>();
    if (!stored || !canAccessRole(stored.role, Role.STAFF)) {
      router.replace('/login');
      return;
    }
    if (!session || session.workRole !== WorkRole.CASHIER) {
      if (!isStoreOwner(stored.role)) {
        router.replace('/dashboard/staff/setup');
      }
      return;
    }
    setUser((prev) => {
      if (prev && prev.email === stored.email) return prev;
      return stored;
    });

    Promise.all([
      MenuController.getItems(),
      PaymentMethodController.getActive(),
    ])
      .then(([menu, payments]) => {
        setMenuItems(menu);
        setPaymentMethods(payments);
        if (payments.length > 0) {
          setPaymentMethod(payments[0].code);
          setPaymentLabel(payments[0].label);
        }
      })
      .catch(() => setError('Không tải được dữ liệu'))
      .finally(() => setLoadingMenu(false));
  }, [router, session]);

  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);

  const handleSelectItem = (item: MenuItem) => {
    const hasToppings = (item.toppings?.length ?? 0) > 0;
    if (!hasToppings) {
      addWithToppings(item, []);
      return;
    }
    setToppingItem(item);
  };

  const addWithToppings = (item: MenuItem, toppings: Topping[]) => {
    setCart((prev) => {
      const existing = findMatchingLine(prev, item.id, toppings);
      if (existing) {
        return prev.map((c) =>
          c.cartLineId === existing.cartLineId
            ? { ...c, quantity: c.quantity + 1 }
            : c,
        );
      }
      return [...prev, buildCartLine(item, toppings)];
    });
    setToppingItem(null);
  };

  const updateQty = (cartLineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.cartLineId === cartLineId
            ? { ...c, quantity: c.quantity + delta }
            : c,
        )
        .filter((c) => c.quantity > 0),
    );
  };

  const handlePrint = () => window.print();

  const handleConfirm = async () => {
    if (!session || !user) return;
    setSubmitting(true);
    setError('');

    try {
      const order = await OrderController.create({
        items: cartToOrderItems(cart),
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        tableNumber: tableNumber || undefined,
        note: note || undefined,
        paymentMethod,
        workShift: session.workShift,
        subtotal,
        total: subtotal,
      });
      setConfirmedOrder(order);
      setStep('confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác nhận thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setNote('');
    if (paymentMethods[0]) {
      setPaymentMethod(paymentMethods[0].code);
      setPaymentLabel(paymentMethods[0].label);
    }
    setConfirmedOrder(null);
    setCheckoutOpen(false);
    setStep('menu');
  };

  const handleLogout = () => {
    clearStaffSession();
    AuthController.logout();
    router.replace('/login');
  };

  const openCheckout = () => setCheckoutOpen(true);

  const proceedToInvoice = () => {
    setCheckoutOpen(false);
    setStep('invoice');
  };

  const goBack = () => {
    if (step === 'invoice') setStep('menu');
  };

  if (!user || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-500">
        Đang tải...
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const orderItems = cartToOrderItems(cart);

  return (
    <StaffLayout compact>
    <div className={`min-h-full ${BRAND.pageBg} print:bg-white`}>
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md print:hidden">
        <div
          className={`mx-auto flex items-center justify-between px-4 py-3 ${step === 'menu' ? 'max-w-[100%]' : 'max-w-4xl'}`}
        >
          <div>
            <p className={`text-xs font-medium ${BRAND.primaryText}`}>
              {WORK_ROLE_LABELS[WorkRole.CASHIER]} ·{' '}
              {WORK_SHIFT_LABELS[session.workShift]}
            </p>
            <h1 className="text-lg font-bold text-stone-900">Quầy thu ngân</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-stone-600 sm:inline">
              {user.fullName}
            </span>
            <Link
              href="/dashboard/staff/cashier/orders"
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
            >
              Quản lý đơn
            </Link>
            <button
              type="button"
              onClick={() => router.push('/dashboard/staff/setup')}
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
            >
              Đổi ca
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
            >
              Thoát
            </button>
          </div>
        </div>

        <div
          className={`mx-auto flex gap-2 px-4 pb-3 ${step === 'menu' ? 'max-w-[100%]' : 'max-w-4xl'}`}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`flex-1 rounded-lg py-2 text-center text-xs font-semibold transition ${
                i <= stepIndex
                  ? `${BRAND.primary} text-white shadow-sm`
                  : 'bg-stone-200/80 text-stone-500'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </header>

      <main
        className={`mx-auto px-4 py-4 print:hidden ${step === 'menu' ? 'max-w-[100%]' : 'max-w-4xl py-6'}`}
      >
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        {step === 'menu' && (
          <CashierMenuStep
            menuItems={menuItems}
            loadingMenu={loadingMenu}
            cart={cart}
            subtotal={subtotal}
            onSelectItem={handleSelectItem}
            onUpdateQty={updateQty}
            onContinue={openCheckout}
          />
        )}

        {step === 'invoice' && (
          <div className="mx-auto max-w-md space-y-4">
            <InvoicePreview
              printable
              items={orderItems}
              customerName={customerName}
              customerPhone={customerPhone}
              tableNumber={tableNumber}
              note={note}
              paymentMethod={paymentMethod}
              paymentMethodLabel={paymentLabel}
              workShift={session.workShift}
              staffName={user.fullName}
              subtotal={subtotal}
              total={subtotal}
              createdAt={new Date().toISOString()}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 rounded-xl border border-stone-200 bg-white py-3 text-sm font-medium"
              >
                ← Sửa đơn
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className={`flex-1 rounded-xl border py-3 text-sm font-semibold ${BRAND.primarySoft}`}
              >
                In hóa đơn
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {submitting ? '...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && confirmedOrder && (
          <div className="mx-auto max-w-md space-y-4 text-center">
            <div className="rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-100">
              <p className="text-4xl">✅</p>
              <h2 className="mt-2 text-xl font-bold text-emerald-800">Hoàn tất!</h2>
              <p className="mt-1 font-mono text-sm text-stone-600">
                {confirmedOrder.invoiceNumber}
              </p>
              <p className="mt-2 text-lg font-bold text-amber-700">
                {formatCurrency(confirmedOrder.total)}
              </p>
            </div>
            <InvoicePreview
              printable
              invoiceNumber={confirmedOrder.invoiceNumber}
              orderNumber={confirmedOrder.orderNumber}
              items={confirmedOrder.items}
              customerName={confirmedOrder.customerName}
              customerPhone={confirmedOrder.customerPhone}
              tableNumber={confirmedOrder.tableNumber}
              note={confirmedOrder.note}
              paymentMethod={confirmedOrder.paymentMethod}
              workShift={confirmedOrder.workShift}
              staffName={confirmedOrder.staffName}
              subtotal={confirmedOrder.subtotal}
              total={confirmedOrder.total}
              createdAt={confirmedOrder.createdAt}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 rounded-xl border border-amber-300 py-3 font-semibold text-amber-900"
              >
                In lại
              </button>
              <button
                type="button"
                onClick={handleNewOrder}
                className={`flex-1 rounded-xl py-3 font-bold text-white ${BRAND.primary}`}
              >
                + Đơn mới
              </button>
            </div>
          </div>
        )}
      </main>

      <ToppingModal
        item={toppingItem}
        onClose={() => setToppingItem(null)}
        onConfirm={(toppings) => toppingItem && addWithToppings(toppingItem, toppings)}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        subtotal={subtotal}
        customerName={customerName}
        customerPhone={customerPhone}
        tableNumber={tableNumber}
        note={note}
        paymentMethod={paymentMethod}
        paymentOptions={paymentMethods}
        onCustomerNameChange={setCustomerName}
        onCustomerPhoneChange={setCustomerPhone}
        onTableNumberChange={setTableNumber}
        onNoteChange={setNote}
        onPaymentMethodChange={(code) => {
          setPaymentMethod(code);
          const p = paymentMethods.find((x) => x.code === code);
          setPaymentLabel(p?.label ?? code);
        }}
        onSubmit={proceedToInvoice}
      />

      <div className="hidden print:block">
        {(step === 'invoice' || step === 'confirm') && (
          <InvoicePreview
            printable
            invoiceNumber={confirmedOrder?.invoiceNumber}
            orderNumber={confirmedOrder?.orderNumber}
            items={confirmedOrder?.items ?? orderItems}
            customerName={customerName}
            customerPhone={customerPhone}
            tableNumber={tableNumber}
            note={note}
            paymentMethod={paymentMethod}
            workShift={session.workShift}
            staffName={user.fullName}
            subtotal={subtotal}
            total={subtotal}
            createdAt={confirmedOrder?.createdAt ?? new Date().toISOString()}
          />
        )}
      </div>
    </div>
    </StaffLayout>
  );
}
