"use client"

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          ケモノピア
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/events" className="text-foreground hover:text-primary transition-colors">
            イベント
          </Link>
          <Link href="/login" className="text-foreground hover:text-primary transition-colors">
            ログイン
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </nav>
    </header>
  );
}