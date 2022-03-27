import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Chip from "@material-ui/core/Chip"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import QuantityButton from "../../ProductList/QuantityButton"
import formatMoney from "../../../../utils/formatMoney"
import { removeFromCart } from "../../../contexts/actions/cart-actions"

import Favorite from "../../ui/Favorite"
import SubscriptionIcon from "../../../images/Subscription"
import DeleteIcon from "../../../images/Delete"
import { CartContext } from "../../../contexts"

const useStyles = makeStyles(theme => ({
  productImage: {
    height: "10rem",
    width: "10rem",
    // backgroundColor: "red",
  },
  name: {
    color: theme.palette.secondary.main,
  },
  id: {
    color: theme.palette.secondary.main,
    fontSize: "0.7rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.65rem",
    },
  },
  actionWrapper: {
    height: "2.8rem",
    width: "2.8rem",
    marginBottom: -8,
    [theme.breakpoints.down("xs")]: {
      height: "1.8rem",
      width: "1.8rem",
    },
  },
  infoContainer: {
    width: "35rem",
    height: "8rem",
    position: "relative",
    marginLeft: "1rem",
  },
  chipWrapper: {
    position: "absolute",
    left: "0.5rem",
    top: "3.5rem",
  },
  itemContainer: {
    margin: "2.6rem 0 2.6rem 11rem",
    [theme.breakpoints.down("md")]: {
      margin: "2rem 0",
    },
  },
  actionButton: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "12px 6px",
    },
  },
}))

function CartItem({ item }) {
  const classes = useStyles()
  const theme = useTheme()
  const { dispatchCart } = useContext(CartContext)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const handleDelete = () => {
    dispatchCart(removeFromCart(item.variant, item.quantity))
  }

  // console.log(`item ->`, item)

  const actions = [
    {
      component: Favorite,
      props: {
        color: theme.palette.secondary.main,
        size: matchesXS ? 1.8 : 2.8,
        customizeStyles: classes.actionButton,
        variant: item.variant.id,
      },
    },
    { icon: SubscriptionIcon, color: theme.palette.secondary.main },
    {
      icon: DeleteIcon,
      color: theme.palette.error.main,
      size: matchesXS ? "1.65rem" : "2.5rem",
      onClick: handleDelete,
    },
  ]
  return (
    <Grid item container classes={{ root: classes.itemContainer }}>
      <Grid item>
        <img
          src={`${process.env.GATSBY_STRAPI_URL}${item.variant.images[0].url}`}
          alt={item.variant.id}
          className={classes.productImage}
        />
      </Grid>

      <Grid
        item
        container
        direction={matchesXS ? "row" : "column"}
        justify="space-between"
        classes={{ root: classes.infoContainer }}
      >
        <Grid item container justify="space-between">
          <Grid item>
            <Typography variant="h5" classes={{ root: classes.name }}>
              {item.name}
            </Typography>
          </Grid>

          <Grid item>
            <QuantityButton
              name={item.name}
              selectedVariant={0}
              variants={[item.variant]}
              stock={[{ quantity: item.stock }]}
              isCart
            />
          </Grid>
        </Grid>

        <Grid item classes={{ root: classes.chipWrapper }}>
          <Chip label={formatMoney(item.variant.price)} />
        </Grid>

        <Grid item container justify="space-between" alignItems="flex-end">
          <Grid item sm xs={7}>
            <Typography variant="body1" classes={{ root: classes.id }}>
              ID: {item.variant.id}
            </Typography>
          </Grid>

          <Grid item container sm xs={5} justify="flex-end">
            {actions.map((action, i) => (
              <Grid item key={i}>
                {action.component ? (
                  <action.component {...action.props} />
                ) : (
                  <IconButton
                    classes={{ root: classes.actionButton }}
                    disableRipple
                    onClick={() => action.onClick()}
                  >
                    <span
                      className={classes.actionWrapper}
                      style={{ height: action.size, width: action.size }}
                    >
                      <action.icon color={action.color} />
                    </span>
                  </IconButton>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CartItem
