import React, { useState, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Rating from "../../Home/Rating"
import Form from "../../Account/auth/Form"
import { UserContext } from "../../../contexts"
import { setUser } from "../../../contexts/actions/user-actions"
import dayjs from "dayjs"
let advancedFormat = require("dayjs/plugin/advancedFormat")
let relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(relativeTime, advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  light: {
    color: theme.palette.primary.main,
  },
  smallDate: {
    fontSize: "1.2rem",
  },
  date: {
    marginTop: "-0.5rem",
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function ProductReview() {
  const classes = useStyles()
  const { user } = useContext(UserContext)

  return (
    <Grid item container direction="column">
      <Grid item container justify="space-between">
        {/*  name here... */}
        <Grid item>
          <Typography variant="h4" classes={{ root: classes.light }}>
            {user.username}
          </Typography>
        </Grid>

        {/* star rating here... */}
        <Grid item>
          <Rating number={0} size={2.5} />
        </Grid>
      </Grid>

      <Grid item>
        <Typography
          variant="h5"
          classes={{ root: clsx(classes.light, classes.date) }}
        >
          {dayjs().to(dayjs("1990-01-01"))}

          <span className={classes.smallDate}>
            {` (${dayjs("1990-01-01").format("Do MMM YYYY")})`}
          </span>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default ProductReview
