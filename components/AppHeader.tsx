"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/bbps-assistant", label: "BBPS Assistant" },
  { href: "/payment-flow", label: "Payment Flow" },
  { href: "/js-internals", label: "JS Playground" },
  { href: "/company-solutions", label: "Company Solution" },
  { href: "/journey", label: "Portfolio" }
];

function getRouteName(pathname: string) {
  if (pathname === "/") return "PayAi Landing";
  if (pathname === "/bbps-assistant") return "BBPS AI Assistant";
  if (pathname === "/payment-flow") return "Payment & Blockchain Flow";
  if (pathname === "/js-internals") return "JS Playground";
  if (pathname === "/company-solutions") return "Company Solution UI";
  if (pathname === "/journey") return "Satish Portfolio";
  return pathname.replaceAll("/", " ").trim() || "Home";
}

export default function AppHeader() {
  const pathname = usePathname();
  const routeName = getRouteName(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="app-header-wrap">
      <div className="app-header">
        <div className="header-top">
          <motion.div
            className="brand-block"
            initial={{ x: -42, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Link href="/" className="brand">
              <span>Pay</span>Ai
            </Link>
            <p className="brand-sub">Payment Intelligence Suite</p>
          </motion.div>

          <motion.div
            className="route-chip"
            aria-live="polite"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
          >
            <span>Active Workspace</span>
            <AnimatePresence mode="wait">
              <motion.strong
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <i className="route-dot" aria-hidden="true" />
                {routeName}
              </motion.strong>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ x: 42, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.06 }}
          >
            <button
              type="button"
              className={menuOpen ? "menu-btn open" : "menu-btn"}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </motion.div>
        </div>

        <motion.div
          className="nav-shell desktop-nav"
          initial={{ scaleX: 0.84, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
        >
          <span className="nav-caption">Navigate</span>
          <nav className="app-nav" aria-label="Main navigation">
          {navItems.map((item, index) => {
            const active = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ x: index % 2 === 0 ? -26 : 26, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.38, ease: "easeOut", delay: 0.14 + index * 0.05 }}
              >
                <Link href={item.href} className={active ? "nav-link active" : "nav-link"}>
                  {item.label}
                  {active ? <motion.span layoutId="nav-pill" className="nav-pill" /> : null}
                </Link>
              </motion.div>
            );
          })}
          </nav>
        </motion.div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={active ? "mobile-link active" : "mobile-link"}>
                    {item.label}
                  </Link>
                );
              })}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
