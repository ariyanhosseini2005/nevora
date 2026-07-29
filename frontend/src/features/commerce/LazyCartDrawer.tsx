"use client";

import dynamic from "next/dynamic";
import { useCart } from "./CartProvider";

const CartDrawer = dynamic(
  () => import("./CartDrawer").then((module) => module.CartDrawer),
  { ssr: false },
);

export function LazyCartDrawer() {
  const { isOpen, hasOpened } = useCart();

  if (!isOpen && !hasOpened) return null;

  return <CartDrawer />;
}
