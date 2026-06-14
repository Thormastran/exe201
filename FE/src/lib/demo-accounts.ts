/** Tài khoản demo chủ cửa hàng (ADMIN) — seed khi BE khởi động */



export const DEMO_PASSWORD = 'Demo@123';



export type DemoSegment = 'solo' | 'store' | 'chain';



export const DEMO_SOLO = {

  segment: 'solo' as const,

  label: 'SOLO — Tự vận hành',

  description: 'Xe take-away · 1 mình · gói Solo 99k',

  identifier: 'demo-solo@bobapos.test',

  password: DEMO_PASSWORD,

  storeSlug: 'demo-solo',

} as const;



export const DEMO_STORE = {

  segment: 'store' as const,

  label: 'STORE — Cửa hàng + NV',

  description: '1 chi nhánh · 4 NV mẫu · gói Store 299k',

  identifier: 'demo-store@bobapos.test',

  password: DEMO_PASSWORD,

  storeSlug: 'demo-store',

} as const;



export const DEMO_CHAIN = {

  segment: 'chain' as const,

  label: 'CHAIN — Chuỗi cửa hàng',

  description: '4 chi nhánh · 6 NV mẫu · gói Premium 599k',

  identifier: 'demo-chain@bobapos.test',

  password: DEMO_PASSWORD,

  storeSlug: 'demo-chain',

} as const;



export const DEMO_ACCOUNTS = [DEMO_SOLO, DEMO_STORE, DEMO_CHAIN] as const;



export function getDemoAccount(segment: DemoSegment) {

  return DEMO_ACCOUNTS.find((d) => d.segment === segment)!;

}


