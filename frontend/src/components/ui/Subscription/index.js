import React, { useState, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Dialog from "@material-ui/core/Dialog"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Chip from "@material-ui/core/Chip"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import clsx from "clsx"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import QuantityButton from "../../ProductList/QuantityButton"
import { CartContext, FeedbackContext } from "../../../contexts"
import { addToCart } from "../../../contexts/actions/cart-actions"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
import SubscriptionIcon from "../../../images/Subscription"

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    width: ({ size }) => `${size || 2.8}rem`,
    height: ({ size }) => `${size || 2.8}rem`,
  },
  row: {
    height: "4rem",
    padding: "0 0.5rem",
    [theme.breakpoints.down("xs")]: {
      height: "auto",
    },
  },
  dark: {
    backgroundColor: theme.palette.secondary.main,
  },
  light: {
    backgroundColor: theme.palette.primary.main,
  },
  iconButton: {
    padding: 0,
  },
  cartButton: {
    height: "8rem",
    width: "100%",
    borderRadius: 0,
    [theme.breakpoints.down("xs")]: {
      height: "auto",
    },
  },
  cartText: {
    color: theme.palette.common.WHITE,
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "3rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "2rem",
    },
  },
  dialog: {
    borderRadius: 0,
    [theme.breakpoints.down("xs")]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  chipRoot: {
    backgroundColor: theme.palette.common.WHITE,
    height: "3rem",
    borderRadius: 50,
    "&:hover": {
      cursor: "pointer",
    },
  },
  chipLabel: {
    color: theme.palette.secondary.main,
  },
  select: {
    "&.MuiSelect-select": {
      paddingRight: 0,
    },
  },
  menu: {
    backgroundColor: theme.palette.primary.main,
  },
  menuItem: {
    color: theme.palette.common.WHITE,
  },
  buttonWrapper: {
    width: "100%",
  },
  // something: {},
}))

function Subscription({ size, round, stock, name, variant, selectedVariant }) {
  const classes = useStyles({ size })
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [frequency, setFrequency] = useState("Month")
  const { dispatchFeedback } = useContext(FeedbackContext)
  const { dispatchCart } = useContext(CartContext)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const frequencies = [
    "Week",
    "Two Weeks",
    "Three Weeks",
    "Month",
    "Three Months",
    "Six Months",
    "Year",
  ]

  const handleCart = () => {
    dispatchCart(
      addToCart(
        variant,
        quantity,
        name,
        stock[selectedVariant].quantity,
        frequency
      )
    )

    setOpen(false)
    dispatchFeedback(
      setSnackbar({ status: "success", message: "Subscription added to cart" })
    )
  }
  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        classes={{ root: classes.iconButton }}
      >
        <span className={classes.iconWrapper}>
          <SubscriptionIcon />
        </span>
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        fullScreen={matchesXS}
        maxWidth="md"
        classes={{ paper: classes.dialog }}
      >
        <Grid container direction="column" alignItems="center">
          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            classes={{ root: clsx(classes.row, classes.dark) }}
          >
            <Grid item>
              <Typography variant="h4">Quantity</Typography>
            </Grid>

            <Grid item>
              <QuantityButton
                stock={stock}
                selectedVariant={selectedVariant}
                white
                hideCartButton
                round
                override={{ value: quantity, setValue: setQuantity }}
              />
            </Grid>
          </Grid>

          <Grid
            item
            container
            justify="space-between"
            alignItems="center"
            direction={matchesXS ? "column" : "row"}
            classes={{ root: clsx(classes.row, classes.light) }}
          >
            <Grid item>
              <Typography variant="h4">Deliver Every</Typography>
            </Grid>

            <Grid item>
              <Select
                value={frequency}
                disableUnderline
                IconComponent={() => null}
                MenuProps={{ classes: { paper: classes.menu } }}
                classes={{ select: classes.select }}
                onChange={e => setFrequency(e.target.value)}
                renderValue={selected => (
                  <Chip
                    label={selected}
                    classes={{
                      root: classes.chipRoot,
                      label: classes.chipLabel,
                    }}
                  />
                )}
              >
                {frequencies.map(choice => (
                  <MenuItem
                    key={choice}
                    value={choice}
                    classes={{ root: classes.menuItem }}
                  >
                    {" "}
                    {choice}{" "}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          <Grid item classes={{ root: classes.buttonWrapper }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCart}
              classes={{ root: classes.cartButton }}
            >
              <Typography variant="h1" classes={{ root: classes.cartText }}>
                Confirm Subscription
              </Typography>
            </Button>
          </Grid>

          {matchesXS && (
            <Grid item>
              <Button onClick={() => setOpen(false)}>
                <Typography variant="body2">Cancel</Typography>
              </Button>
            </Grid>
          )}
        </Grid>
      </Dialog>
    </>
  )
}

export default Subscription
