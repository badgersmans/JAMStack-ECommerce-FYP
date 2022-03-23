import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
} from "../constants/action-types"

// action creators
export const addToCart = (variant, quantity, name, stock) => ({
  type: ADD_TO_CART,
  payload: { variant, quantity, name, stock },
})

export const removeFromCart = (variant, quantity) => ({
  type: REMOVE_FROM_CART,
  payload: { variant, quantity },
})

export const clearCart = () => ({
  type: CLEAR_CART,
})
