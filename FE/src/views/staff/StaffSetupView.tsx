'use client';



import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { BRAND } from '@/lib/brand';

import { getStoredUser } from '@/lib/auth-storage';
import { canAccessRole } from '@/lib/role-access';

import { saveStaffSession } from '@/lib/staff-session-storage';

import {

  STAFF_ROUTES,

  WORK_ROLE_LABELS,

  WORK_SHIFT_HOURS,

  WORK_SHIFT_LABELS,

  WorkRole,

  WorkShift,

} from '@/models/staff.model';

import { Role, User } from '@/models/user.model';

import { StaffLayout } from './StaffLayout';



type SetupStep = 'shift' | 'role';



export function StaffSetupView() {

  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [step, setStep] = useState<SetupStep>('shift');

  const [selectedShift, setSelectedShift] = useState<WorkShift | null>(null);



  useEffect(() => {

    const stored = getStoredUser<User>();

    if (!stored || !canAccessRole(stored.role, Role.STAFF)) {
      router.replace('/login');
      return;
    }

    setUser((prev) => {
      if (prev && prev.email === stored.email) return prev;
      return stored;
    });

  }, [router]);



  const handleSelectShift = (shift: WorkShift) => {

    setSelectedShift(shift);

    setStep('role');

  };



  const handleSelectRole = (role: WorkRole) => {

    if (!selectedShift) return;



    saveStaffSession({

      workShift: selectedShift,

      workRole: role,

      startedAt: new Date().toISOString(),

    });



    router.replace(STAFF_ROUTES[role]);

  };



  if (!user) {

    return (

      <div className={`flex min-h-screen items-center justify-center ${BRAND.pageBg}`}>

        <div className={`h-10 w-10 animate-spin rounded-full border-4 ${BRAND.spinner}`} />

      </div>

    );

  }



  return (

    <StaffLayout>

      <div className="mx-auto max-w-2xl">

        <div

          className={`mb-8 rounded-2xl bg-gradient-to-r ${BRAND.headerGradient} p-6 text-white shadow-lg`}

        >

          <h1 className="text-2xl font-bold">Xin chào, {user.fullName}</h1>

          <p className="mt-2 text-sm text-white/85">

            {step === 'shift'

              ? 'Bước 1: Chọn ca làm việc hôm nay'

              : 'Bước 2: Chọn vai trò làm việc'}

          </p>

        </div>



        {step === 'shift' ? (

          <div className="grid gap-4 sm:grid-cols-2">

            {Object.values(WorkShift).map((shift) => (

              <button

                key={shift}

                type="button"

                onClick={() => handleSelectShift(shift)}

                className={`rounded-xl border-2 bg-white p-5 text-left transition hover:shadow-md ${BRAND.primarySoft}`}

              >

                <p className="text-lg font-semibold text-stone-800">

                  {WORK_SHIFT_LABELS[shift]}

                </p>

                <p className="mt-1 text-sm text-stone-500">{WORK_SHIFT_HOURS[shift]}</p>

              </button>

            ))}

          </div>

        ) : (

          <>

            <button

              type="button"

              onClick={() => setStep('shift')}

              className={`mb-4 text-sm ${BRAND.primaryText} hover:underline`}

            >

              ← Đổi ca ({selectedShift && WORK_SHIFT_LABELS[selectedShift]})

            </button>

            <div className="grid gap-4 sm:grid-cols-2">

              <button

                type="button"

                onClick={() => handleSelectRole(WorkRole.CASHIER)}

                className={`rounded-xl border-2 bg-white p-6 text-left transition hover:shadow-md ${BRAND.primarySoft}`}

              >

                <p className="text-3xl">💰</p>

                <p className="mt-3 text-lg font-semibold text-stone-800">

                  {WORK_ROLE_LABELS[WorkRole.CASHIER]}

                </p>

                <p className="mt-1 text-sm text-stone-500">

                  Tạo đơn, thanh toán và in hóa đơn

                </p>

              </button>

              <button

                type="button"

                onClick={() => handleSelectRole(WorkRole.SERVER)}

                className="rounded-xl border-2 border-emerald-100 bg-emerald-50/80 p-6 text-left transition hover:border-emerald-300 hover:shadow-md"

              >

                <p className="text-3xl">🍹</p>

                <p className="mt-3 text-lg font-semibold text-stone-800">

                  {WORK_ROLE_LABELS[WorkRole.SERVER]}

                </p>

                <p className="mt-1 text-sm text-stone-500">

                  Xem danh sách đơn và phục vụ khách

                </p>

              </button>

            </div>

          </>

        )}

      </div>

    </StaffLayout>

  );

}


