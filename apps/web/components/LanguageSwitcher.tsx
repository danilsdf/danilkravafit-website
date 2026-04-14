"use client";
import { useRouter, usePathname } from 'next/navigation';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1];

  const handleChange = (lang: string) => {
    if (lang !== currentLang) {
      const segments = pathname.split('/');
      segments[1] = lang;
      router.push(segments.join('/'));
    }
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`px-2 py-1 rounded text-xs font-semibold transition-colors duration-150 ${currentLang === lang.code ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-blue-400/80'}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
