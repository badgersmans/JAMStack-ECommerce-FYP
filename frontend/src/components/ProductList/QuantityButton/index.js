import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Badge from "@material-ui/core/Badge"
import clsx from "clsx"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import { makeStyles } from "@material-ui/core/styles"

import { CartContext } from "../../../contexts"
import {
  addToCart,
  removeFromCart,
} from "../../../contexts/actions/cart-actions"
import Cart from "../../../images/Cart"

const useStyles = makeStyles(theme => ({
  quantityText: {
    color: ({ isCart }) =>
      isCart ? theme.palette.secondary.main : theme.palette.common.WHITE,
  },
  mainGroup: {
    height: "3rem",
  },
  editButtons: {
    height: "1.525rem",
    borderRadius: 0,
    backgroundColor: ({ isCart }) =>
      isCart ? theme.palette.common.WHITE : theme.palette.secondary.main,
    borderLeft: ({ isCart }) =>
      `2px solid ${
        isCart ? theme.palette.secondary.main : theme.palette.common.WHITE
      }`,
    borderRight: "2px solid #FFF",
    borderBottom: "none",
    borderTop: "none",
  },
  endButtons: {
    borderRadius: 50,
    backgroundColor: ({ isCart }) =>
      isCart ? theme.palette.common.WHITE : theme.palette.secondary.main,
    border: "none",
  },
  cartButton: {
    marginLeft: "0 !important",
    transition: "background-color 1s ease",
  },
  minusButton: {
    borderTop: ({ isCart }) =>
      `2px solid ${
        isCart ? theme.palette.secondary.main : theme.palette.common.WHITE
      }`,
  },
  minus: {
    marginTop: "-0.25rem",
  },
  quantity: {
    "&:hover": {
      backgroundColor: ({ isCart }) =>
        isCart ? theme.palette.common.WHITE : theme.palette.secondary.main,
    },
  },
  badge: {
    color: theme.palette.common.WHITE,
    fontSize: "1.5rem",
    backgroundColor: theme.palette.secondary.main,
    padding: 0,
  },
  "@global": {
    ".MuiButtonGroup-groupedVertical:not(:first-child)": {
      marginTop: "-0.8px",
    },
  },
  addedToCartText: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.main,
    },
  },
}))

function QuantityButton({ stock, variants, selectedVariant, name, isCart }) {
  // console.log(`variants`, variants)
  const classes = useStyles({ isCart })
  const [addedToCart, setAddedToCart] = useState(false)
  const { cart, dispatchCart } = useContext(CartContext)

  const existingCartItem = cart.find(
    item => item.variant === variants[selectedVariant]
  )
  const [quantity, setQuantity] = useState(
    isCart ? existingCartItem.quantity : 1
  )

  const handleChange = direction => {
    // don't go above the database value
    if (quantity === stock[selectedVariant].quantity && direction === "up") {
      return null
    }
    // quantity must be at least 1
    if (quantity <= 1 && direction === "down") {
      return null
    }
    // otherwise it is an acceptable value
    const newQuantity = direction === "up" ? quantity + 1 : quantity - 1

    setQuantity(newQuantity)

    if (isCart) {
      if (direction === "up") {
        dispatchCart(addToCart(variants[selectedVariant], 1, name))
      } else if (direction === "down") {
        dispatchCart(removeFromCart(variants[selectedVariant], 1))
      }
    }
  }

  const handleCart = () => {
    setAddedToCart(true)

    dispatchCart(
      addToCart(
        variants[selectedVariant],
        quantity,
        name,
        stock[selectedVariant].quantity
      )
    )
  }

  useEffect(() => {
    // consider errors
    if (stock === null || stock === -1) {
      return undefined
    } else if (quantity > stock[selectedVariant].quantity) {
      // consider changes in selectedVariant
      setQuantity(stock[selectedVariant].quantity)
    }
  }, [stock, selectedVariant])

  useEffect(() => {
    let timer

    if (addedToCart) {
      timer = setTimeout(() => setAddedToCart(false), 1500)
    }
    return () => clearTimeout(timer)
  }, [addedToCart])

  return (
    <Grid item>
      <ButtonGroup classes={{ root: classes.mainGroup }}>
        <Button classes={{ root: clsx(classes.endButtons, classes.quantity) }}>
          <Typography variant="h3" classes={{ root: classes.quantityText }}>
            {quantity}
          </Typography>
        </Button>

        <ButtonGroup orientation="vertical">
          <Button
            classes={{ root: classes.editButtons }}
            onClick={() => handleChange("up")}
          >
            <Typography variant="h3" classes={{ root: classes.quantityText }}>
              +
            </Typography>
          </Button>
          <Button
            classes={{ root: clsx(classes.editButtons, classes.minusButton) }}
            onClick={() => handleChange("down")}
          >
            <Typography
              variant="h3"
              classes={{ root: clsx(classes.quantityText, classes.minus) }}
            >
              -
            </Typography>
          </Button>
        </ButtonGroup>

        {isCart ? null : (
          <Button
            classes={{
              root: clsx(classes.endButtons, classes.cartButton, {
                [classes.addedToCartText]: addedToCart,
              }),
            }}
            onClick={handleCart}
            // onClick={() => setAddedToCart(!addedToCart)}
          >
            {addedToCart ? (
              <Typography variant="h3" classes={{ root: classes.quantityText }}>
                ✔
              </Typography>
            ) : (
              <Badge
                overlap="circle"
                badgeContent="+"
                classes={{ badge: classes.badge }}
              >
                <Cart />
              </Badge>
            )}
          </Button>
        )}
      </ButtonGroup>
    </Grid>
  )
}

export default QuantityButton
