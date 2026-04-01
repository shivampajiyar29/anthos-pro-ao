"use client";

import React from 'react';
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function ShortcutProvider({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}
