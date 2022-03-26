import React, { useState, useRef, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import axios from "axios"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"
import Rating from "../../Home/Rating"
import Form from "../../Account/auth/Form"
import { UserContext, FeedbackContext } from "../../../contexts"
import { setUser } from "../../../contexts/actions/user-actions"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"
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
  starBackground: {
    height: "3rem",
    backgroundColor: theme.palette.primary.light,
  },
  cursorOnHover: {
    cursor: "pointer",
  },
  mainContainer: {
    marginBottom: "3rem",
  },
  // something: {},
  // something: {},
}))

function ProductReview({ product, review, setEditComment }) {
  const classes = useStyles()
  const { user } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  const ratingRef = useRef(null)
  const [tempRating, setTempRating] = useState(0)
  const [loading, setLoading] = useState(null)
  const [rating, setRating] = useState(review ? review.rating : null)
  const [values, setValues] = useState({
    message: "",
  })
  const fields = {
    message: {
      helperText: "",
      placeholder: "Write your review",
    },
  }

  const handleReview = () => {
    setLoading("Leave Review")

    axios
      .post(
        `${process.env.GATSBY_STRAPI_URL}/reviews`,
        {
          text: values.message,
          rating,
          product,
        },
        {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        }
      )
      .then(response => {
        setLoading(null)

        dispatchFeedback(
          setSnackbar({ status: "success", message: "Review submitted" })
        )
      })
      .catch(error => {
        setLoading(null)

        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem leaving your review, please try again.",
          })
        )
      })
  }

  return (
    <Grid
      item
      container
      direction="column"
      classes={{ root: classes.mainContainer }}
    >
      <Grid item container justify="space-between">
        {/*  name here... */}
        <Grid item>
          <Typography variant="h4" classes={{ root: classes.light }}>
            {review ? review.user.username : user.username}
          </Typography>
        </Grid>

        {/* star rating here... */}
        <Grid
          item
          ref={ratingRef}
          classes={{
            root: clsx(classes.starBackground, {
              [classes.cursorOnHover]: !review,
            }),
          }}
          onClick={() => (review ? null : setRating(tempRating))}
          onMouseMove={e => {
            if (review) return

            //   * -5 to get a positive number
            const hoverRating =
              ((ratingRef.current.getBoundingClientRect().left - e.clientX) /
                ratingRef.current.getBoundingClientRect().width) *
              -5

            //   example we want the closest 0.5 from 2.7 (which is 2.5)
            // 2.7 * 2 = 5.4 then rounding it would become 5, then divided by 2 would become 2.5
            // console.log(Math.round(hoverRating * 2) / 2)
            setTempRating(Math.round(hoverRating * 2) / 2)
          }}
          onMouseLeave={() => {
            //   this is so that the stars reset when mouse leaves
            if (tempRating > rating) {
              setTempRating(rating)
            }
          }}
        >
          {/* use whichever number is larger for the rating */}
          <Rating
            number={rating > tempRating ? rating : tempRating}
            size={2.5}
          />
        </Grid>
      </Grid>

      {/* date here... */}
      <Grid item>
        <Typography
          variant="h5"
          classes={{ root: clsx(classes.light, classes.date) }}
        >
          {review
            ? dayjs().to(dayjs(review.createdAt))
            : dayjs().to(dayjs("1990-01-01"))}

          <span className={classes.smallDate}>
            {review
              ? ` (${dayjs(review.createdAt).format("Do MMM YYYY")})`
              : ` (${dayjs("1990-01-01").format("Do MMM YYYY")})`}
          </span>
        </Typography>
      </Grid>

      {/* comment form here... */}
      <Grid item>
        {review ? (
          <Typography variant="body1">{review.text}</Typography>
        ) : (
          <Form
            values={values}
            setValues={setValues}
            fields={fields}
            fullWidth
            noError
          />
        )}
      </Grid>

      {/* buttons here... */}
      {review ? null : (
        <Grid item container classes={{ root: classes.buttonContainer }}>
          <Grid item>
            {loading === "Leave Review" ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleReview}
                disabled={!rating}
              >
                <span className={classes.reviewButtonText}>Leave Review</span>
              </Button>
            )}
          </Grid>

          <Grid item>
            <Button onClick={() => setEditComment(false)}>
              <span className={classes.cancelButtonText}>Cancel</span>
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default ProductReview
