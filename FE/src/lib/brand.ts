/** Màu chủ đạo POS — #2F80ED, đồng bộ toàn hệ thống */

export const BRAND_HEX = '#2F80ED';



export const BRAND = {

  hex: BRAND_HEX,

  sidebar: 'from-slate-950 via-[#1e4d8c] to-slate-950',

  pageBg: 'bg-gradient-to-br from-slate-50 via-[#2F80ED]/8 to-slate-100',

  headerGradient: 'from-[#2F80ED] to-[#1B5BB8]',

  primary: 'bg-[#2F80ED] hover:bg-[#2569c7]',

  primaryText: 'text-[#2F80ED]',

  primaryRing: 'ring-[#2F80ED]/30 focus:ring-[#2F80ED]',

  primarySoft: 'bg-[#2F80ED]/10 text-[#1a4a8a] border-[#2F80ED]/25',

  navActive: 'bg-white/15 text-white shadow-inner',

  spinner: 'border-[#2F80ED]/25 border-t-[#2F80ED]',

  focusBorder: 'focus:border-[#2F80ED] focus:ring-[#2F80ED]/25',

} as const;



/** Ảnh món mẫu (public/menu — đồng bộ với BE menu-images.ts) */

export const MENU_IMAGE_BY_NAME: Record<string, string> = {
  'Trà sữa trân châu đường đen': '/menu/tra-sua-tran-chau.jpg',
  'Trà sữa matcha': '/menu/tra-sua-matcha.jpg',
  'Trà sữa oolong': '/menu/tra-sua-oolong.jpg',
  'Trà sữa khoai môn': '/menu/tra-sua-khoai-mon.jpg',
  'Trà đào cam sả': '/menu/tra-dao-cam-sa.jpg',
  'Trà vải': '/menu/tra-vai.jpg',
  'Trà chanh leo': '/menu/tra-chanh-leo.jpg',
  'Hồng trà kem cheese': '/menu/hong-tra-kem-cheese.jpg',
  'Trà xanh kem cheese': '/menu/tra-xanh-kem-cheese.jpg',
  'Cacao sữa': '/menu/cacao-sua.jpg',
  'Cacao đá xay': '/menu/cacao-da-xay.jpg',
  'Cà phê sữa đá': '/menu/ca-phe-sua-da.jpg',
};

export const DEFAULT_MENU_IMAGE = '/menu/tra-sua-tran-chau.jpg';



/** Logo & ảnh cover marketing (public/brand) */

export const BRAND_LOGO = '/brand/logo.png';

export const BRAND_COVER = '/brand/cover.png';



export function menuImageUrl(name: string, imageUrl?: string): string {
  const raw = imageUrl || MENU_IMAGE_BY_NAME[name] || DEFAULT_MENU_IMAGE;
  if (raw.includes('images.unsplash.com')) {
    return MENU_IMAGE_BY_NAME[name] || DEFAULT_MENU_IMAGE;
  }
  return raw;
}


