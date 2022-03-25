import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  drawer: {
    height: "100%",
    width: "30rem",
    backgroundColor: theme.palette.primary.main,
  },
  // drawer: {},
  // drawer: {},
  // drawer: {},
}))

function OrderDetails({ open, setOpen }) {
  const classes = useStyles()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)

  //   console.log(`open? -> `, open)
  return (
    <SwipeableDrawer
      open={!!open}
      onOpen={() => null}
      onClose={() => setOpen(null)}
      classes={{ paper: classes.drawer }}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      //   anchor="right"
    ></SwipeableDrawer>
  )
}

export default OrderDetails
