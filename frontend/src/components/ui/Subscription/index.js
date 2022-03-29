import React, { useState, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Dialog from "@material-ui/core/Dialog"
import Chip from "@material-ui/core/Chip"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import QuantityButton from "../../ProductList/QuantityButton"
import { CartContext } from "../../../contexts"
import SubscriptionIcon from "../../../images/Subscription"

const useStyles = makeStyles(theme => ({
  iconWrapper: {
    width: ({ size }) => `${size || 2.8}rem`,
    height: ({ size }) => `${size || 2.8}rem`,
  },
  row: {
    height: "4rem",
    padding: "0 0.5rem",
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
  },
  cartText: {
    color: theme.palette.common.WHITE,
    fontSize: "4rem",
  },
  dialog: {
    borderRadius: 0,
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function Subscription({ size, round, stock, selectedVariant }) {
  const classes = useStyles({ size })
  const [open, setOpen] = useState(false)
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
        maxWidth="md"
        classes={{ paper: classes.dialog }}
      >
        <Grid container direction="column">
          <Grid
            item
            container
            justify="space-between"
            classes={{ root: clsx(classes.row, classes.dark) }}
            alignItems="center"
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
              />
            </Grid>
          </Grid>

          <Grid
            item
            container
            justify="space-between"
            classes={{ root: clsx(classes.row, classes.light) }}
          >
            <Grid item>
              <Typography variant="h4">Deliver Every</Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              classes={{ root: classes.cartButton }}
            >
              <Typography variant="h1" classes={{ root: classes.cartText }}>
                Confirm Subscription
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default Subscription
