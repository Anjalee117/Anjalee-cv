"use client";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe,
    () => document.documentElement.getAttribute("data-theme") === "dark",
    () => false);
  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { /* Theme still works without storage. */ }
  }
  return <button onClick={toggle} className="btn" aria-label="Toggle dark mode" aria-pressed={dark}>
    {dark ? "LIGHT MODE" : "DARK MODE"}
  </button>;
}
