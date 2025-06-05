"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image_url: string
  variant?: string
}

interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  total: 0,
}

// Calculate cart totals based on items
const calculateTotals = (items: CartItem[]): Omit<CartState, "items"> => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = items.reduce(
    (total, item) => total + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
    0,
  )
  const shipping = 0 // Free shipping for now
  const tax = subtotal * 0.085 // Assuming 8.5% tax rate
  const total = subtotal - discount + shipping + tax

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
  }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload]
      }

      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems),
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload.id)
      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems),
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return {
        ...state,
        items: updatedItems,
        ...calculateTotals(updatedItems),
      }
    }

    case "CLEAR_CART":
      return {
        ...initialState,
      }

    default:
      return state
  }
}

// Create the context
const CartContext = createContext<
  | {
      state: CartState
      dispatch: React.Dispatch<CartAction>
      addToCart: (item: CartItem) => void
      removeFromCart: (id: number) => void
      updateQuantity: (id: number, quantity: number) => void
      clearCart: () => void
    }
  | undefined
>(undefined)

// Sample products for demo purposes
const sampleProducts: CartItem[] = [
  {
    id: 2,
    name: "Airpods Max",
    variant: "Color: Red",
    price: 439.0,
    originalPrice: 549.0,
    quantity: 1,
    image: "images/products/airpods-max.png",
  },
  {
    id: 3,
    name: "Bose Headphones",
    variant: "Color: Black",
    price: 289.99,
    quantity: 1,
    image: "images/products/bose-headphones.png",
  },
  {
    id: 5,
    name: "JBL TUNE 660BTNC",
    variant: "Color: Black",
    price: 159.99,
    quantity: 1,
    image: "images/products/jbl-headphones.png",
  },
]

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with sample data for demo purposes
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    items: sampleProducts,
    ...calculateTotals(sampleProducts),
  })

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartState
        dispatch({ type: "CLEAR_CART" })
        parsedCart.items.forEach((item) => {
          dispatch({ type: "ADD_ITEM", payload: item })
        })
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state))
  }, [state])

  // Helper functions
  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider value={{ state, dispatch, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
