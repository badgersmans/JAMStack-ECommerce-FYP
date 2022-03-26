import React, { useState, useRef, useContext } from "react"
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
  "@global": {
    ".MuiInput-underline:before, .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    ".MuiInput-underline:after": {
      borderBottom: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  reviewButtonText: {
    color: theme.palette.common.WHITE,
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  cancelButtonText: {
    color: theme.palette.primary.main,
    fontFamily: "Montserrat",
    fontWeight: 600,
  },
  buttonContainer: {
    marginTop: "2rem",
  },
  // something: {},
  // something: {},
  // something: {},
}))

function ProductReview() {
  const classes = useStyles()
  const { user } = useContext(UserContext)
  const ratingRef = useRef(null)
  const [values, setValues] = useState({
    message: "",
  })
  const fields = {
    message: {
      helperText: "",
      placeholder: "Write your review",
    },
  }

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
        <Grid
          item
          ref={ratingRef}
          onMouseMove={e => {
            const hoverRating =
              ratingRef.current.getBoundingClientRect().left - e.clientX
          }}
        >
          <Rating number={0} size={2.5} />
        </Grid>
      </Grid>

      {/* date here... */}
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

      {/* comment form here... */}
      <Grid item>
        <Form
          values={values}
          setValues={setValues}
          fields={fields}
          fullWidth
          noError
        />
      </Grid>

      {/* buttons here... */}
      <Grid item container classes={{ root: classes.buttonContainer }}>
        <Grid item>
          <Button variant="contained" color="primary">
            <span className={classes.reviewButtonText}>Leave Review</span>
          </Button>
        </Grid>

        <Grid item>
          <Button>
            <span className={classes.cancelButtonText}>Cancel</span>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductReview
