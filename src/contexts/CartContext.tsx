


import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  finalTotal: number;
  giftcard?: {
    code: string;
    remaining: number;
    percentage_discount?: number;
  };
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_GIFTCARD'; payload: { code: string; remaining: number; percentage_discount?: number } }
  | { type: 'REMOVE_GIFTCARD' };

const calculateDiscount = (giftcard: { code: string; remaining: number; percentage_discount?: number }, total: number): number => {
  let discount = 0;

  // Apply remaining balance discount first
  if (giftcard.remaining > 0) {
    discount += Math.min(giftcard.remaining, total - discount);
  }

  // Apply percentage discount if available (even if remaining is 0)
  if (giftcard.percentage_discount && giftcard.percentage_discount > 0) {
    const percentageDiscount = (total * giftcard.percentage_discount) / 100;
    discount += percentageDiscount;
  }

  return discount;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = state.giftcard ? calculateDiscount(state.giftcard, newTotal) : 0;
        return {
          ...state,
          items: updatedItems,
          total: newTotal,
          finalTotal: Math.max(0, newTotal - discount),
        };
      } else {
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = state.giftcard ? calculateDiscount(state.giftcard, newTotal) : 0;
        return {
          ...state,
          items: updatedItems,
          total: newTotal,
          finalTotal: Math.max(0, newTotal - discount),
        };
      }
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = state.giftcard ? calculateDiscount(state.giftcard, newTotal) : 0;
      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        finalTotal: Math.max(0, newTotal - discount),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = state.giftcard ? calculateDiscount(state.giftcard, newTotal) : 0;
      return {
        ...state,
        items: updatedItems,
        total: newTotal,
        finalTotal: Math.max(0, newTotal - discount),
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0, finalTotal: 0 };
    case 'APPLY_GIFTCARD': {
      const discount = calculateDiscount(action.payload, state.total);
      const finalTotal = Math.max(0, state.total - discount);
      return {
        ...state,
        giftcard: action.payload,
        finalTotal,
      };
    }
    case 'REMOVE_GIFTCARD': {
      return {
        ...state,
        giftcard: undefined,
        finalTotal: state.total,
      };
    }
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyGiftcard: (code: string, remaining: number, percentage_discount?: number) => void;
  removeGiftcard: () => void;
} | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, finalTotal: 0 });

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyGiftcard = (code: string, remaining: number, percentage_discount?: number) => {
    dispatch({ type: 'APPLY_GIFTCARD', payload: { code, remaining, percentage_discount } });
  };

  const removeGiftcard = () => {
    dispatch({ type: 'REMOVE_GIFTCARD' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, applyGiftcard, removeGiftcard }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
