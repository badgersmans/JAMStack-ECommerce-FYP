import React from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import { makeStyles } from "@material-ui/core/styles"
import DayJS from "react-dayjs"
import dayjs from "dayjs"
let advancedFormat = require("dayjs/plugin/advancedFormat")
dayjs.extend(advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  drawer: {
    height: "100%",
    width: "30rem",
    backgroundColor: theme.palette.primary.main,
  },
  id: {
    fontSize: "2.25rem",
    fontWeight: 600,
  },
  bold: {
    fontWeight: 600,
  },
  date: {
    fontWeight: 600,
    marginLeft: "1rem",
  },
  // drawer: {},
  // drawer: {},
}))

function OrderDetails({ open, setOpen, orders }) {
  const classes = useStyles()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const order = orders.find(order => order.id === open)

  // console.log(`open? -> `, open)
  // console.log(`order? -> `, order)
  return (
    <SwipeableDrawer
      open={!!open}
      onOpen={() => null}
      onClose={() => setOpen(null)}
      classes={{ paper: classes.drawer }}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      //   anchor="right"
    >
      <Grid container direction="column">
        <Grid item>
          <Typography
            variant="h2"
            classes={{ root: classes.id }}
            align="center"
          >
            Order #
            {order?.id
              .slice(order.id.length - 10, order.id.length)
              .toUpperCase()}
          </Typography>
        </Grid>

        <Grid item container>
          <Grid item>
            <Chip label={order?.status} classes={{ label: classes.bold }} />
          </Grid>

          <Grid item>
            <Typography variant="body2" classes={{ root: classes.date }}>
              {<DayJS format="Do MMM YYYY h:mma">{order?.createdAt}</DayJS>}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </SwipeableDrawer>
  )
}

export default OrderDetails
