export const isArabicPath = (path: string) =>
  path === '/ar' || path.startsWith('/ar/');

export const toggleLocalePath = (path: string) => {
  // strip query/hash – we only care about the pathname here
  const [pathname, search = ''] = path.split('?');
  if (isArabicPath(pathname)) {
    // /ar  → /
    if (pathname === '/ar') return `/${search}`;
    // /ar/contact → /contact
    return `${pathname.replace(/^\/ar/, '')}${search ? '?' + search : ''}` || '/';
  }
  // /contact → /ar/contact  |  / → /ar
  return pathname === '/'
    ? `/ar${search ? '?' + search : ''}`
    : `/ar${pathname}${search ? '?' + search : ''}`;
};
