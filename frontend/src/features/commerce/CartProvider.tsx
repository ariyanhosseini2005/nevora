"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { products } from "@/features/homepage/data/products";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  isOpen: boolean;
  hasOpened: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "nevora-cart";
const CART_CHANGE_EVENT = "nevora:cart-change";
const MAX_QUANTITY = 8;
const EMPTY_CART: CartLine[] = [];
const productIds = new Set(products.map((product) => product.id));
const CartContext = createContext<CartContextValue | null>(null);

let cachedSerializedCart: string | null | undefined;
let cachedCart: CartLine[] = EMPTY_CART;

function normalizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return EMPTY_CART;

  const normalized = value
    .filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        "productId" in line &&
        "quantity" in line &&
        typeof line.productId === "string" &&
        productIds.has(line.productId) &&
        typeof line.quantity === "number" &&
        Number.isFinite(line.quantity),
    )
    .map((line) => ({
      productId: line.productId,
      quantity: Math.min(Math.max(Math.round(line.quantity), 1), MAX_QUANTITY),
    }));

  return normalized.length > 0 ? normalized : EMPTY_CART;
}

function getCartSnapshot() {
  const serialized = window.localStorage.getItem(STORAGE_KEY);
  if (serialized === cachedSerializedCart) return cachedCart;

  cachedSerializedCart = serialized;

  try {
    cachedCart = serialized ? normalizeCart(JSON.parse(serialized)) : EMPTY_CART;
  } catch {
    cachedCart = EMPTY_CART;
  }

  return cachedCart;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function subscribeToCart(onStoreChange: () => void) {
  const handleChange = () => {
    cachedSerializedCart = undefined;
    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(CART_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CART_CHANGE_EVENT, handleChange);
  };
}

function writeCart(lines: CartLine[]) {
  const normalized = normalizeCart(lines);
  const serialized = JSON.stringify(normalized);
  window.localStorage.setItem(STORAGE_KEY, serialized);
  cachedSerializedCart = serialized;
  cachedCart = normalized;
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const addItem = useCallback((productId: string) => {
    if (!productIds.has(productId)) return;

    const currentLines = getCartSnapshot();
    const existingLine = currentLines.find((line) => line.productId === productId);
    const nextLines = existingLine
      ? currentLines.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(line.quantity + 1, MAX_QUANTITY) }
            : line,
        )
      : [...currentLines, { productId, quantity: 1 }];

    writeCart(nextLines);
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    writeCart(getCartSnapshot().filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      writeCart(getCartSnapshot().filter((line) => line.productId !== productId));
      return;
    }

    writeCart(
      getCartSnapshot().map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(Math.round(quantity), MAX_QUANTITY) }
          : line,
      ),
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      isOpen,
      hasOpened,
      addItem,
      removeItem,
      setQuantity,
      openCart: () => {
        setHasOpened(true);
        setIsOpen(true);
      },
      closeCart: () => setIsOpen(false),
    }),
    [addItem, hasOpened, isOpen, lines, removeItem, setQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }
  return context;
}
