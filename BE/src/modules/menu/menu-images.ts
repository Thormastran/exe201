/** Ảnh món local (FE/public/menu) — ổn định cho demo & thuyết trình */
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

/** URL Unsplash cũ (404) — dùng khi đồng bộ DB */
export const LEGACY_UNSPLASH_HOST = 'images.unsplash.com';

export function imageUrlForMenuName(name: string): string | undefined {
  return MENU_IMAGE_BY_NAME[name];
}
