"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Cloud, Dumbbell, History, Home, Scale, ClipboardCheck } from "lucide-react";

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/poids", label: "Poids", icon: Scale },
  { href: "/sport", label: "Sport", icon: Dumbbell },
  { href: "/recap", label: "Récap", icon: ClipboardCheck },
  { href: "/historique", label: "Historique", icon: History },
  { href: "/bilan", label: "Bilan", icon: BarChart3 },
  { href: "/sync", label: "Sync", icon: Cloud }
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <Activity size={20} aria-hidden="true" />
        </span>
        <span>QuestyLife</span>
      </Link>
      <nav className="nav-links" aria-label="Navigation principale">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link className={`nav-link ${active ? "active" : ""}`} href={href} key={href}>
              <Icon size={18} aria-hidden="true" />
              <span className="nav-label">{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
