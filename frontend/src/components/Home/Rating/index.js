import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import fullStar from "../../../images/full-star.svg"
import halfStar from "../../../images/half-star.svg"
import emptyStar from "../../../images/empty-star.svg"

const useStyles = makeStyles(theme => ({
  size: {
    height: "2rem",
    width: "2rem",
  },
}))

function Rating({ number }) {
  const classes = useStyles()
  const diff = 5 - Math.ceil(number)

  return (
    <>
      {
        // render the full star
        [...Array(Math.floor(number))].map((e, i) => (
          <img
            src={fullStar}
            alt="full star"
            key={i}
            className={classes.size}
          />
        ))
      }
      {
        // half star
        number % 1 !== 0 ? (
          <img src={halfStar} alt="half star" className={classes.size} />
        ) : null
      }
      {
        // empty star
        [...Array(diff)].map((e, i) => (
          <img
            src={emptyStar}
            alt="empty star"
            key={`${i}-empty`}
            className={classes.size}
          />
        ))
      }
    </>
  )
}

export default Rating
