
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(['en', 'ru']);

export function middleware(req) {
  let lng;
  if (req.cookies.NEXT_LOCALE) {
    lng = req.cookies.NEXT_LOCALE;
  } else {
    lng = acceptLanguage.get(req.headers['accept-language']) || 'en';
  }
  // If the language is 'en', do not prefix the route
  if (lng !== 'en' && !req.nextUrl.pathname.startsWith(`/${lng}`)) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url));
  }
  // If the language is 'en' and the route starts with /en, redirect to route without /en
  if (lng === 'en' && req.nextUrl.pathname.startsWith('/en')) {
    return NextResponse.redirect(new URL(req.nextUrl.pathname.replace(/^\/en/, ''), req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)'],
};
