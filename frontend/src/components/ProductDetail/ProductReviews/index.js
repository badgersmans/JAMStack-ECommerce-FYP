import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { useQuery } from "@apollo/client"
import ProductReview from "../ProductReview"
import { GET_REVIEWS } from "../../../apollo/queries"

const useStyles = makeStyles(theme => ({
  reviews: {
    padding: "0 3rem",
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function ProductReviews({ product, editComment, setEditComment }) {
  const classes = useStyles()
  const { data } = useQuery(GET_REVIEWS, { variables: { id: product } })
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    if (data) {
      // console.log(`data? ->`, data)
      setReviews(data.product.reviews)
    }
  }, [data])
  console.log(`reviews? ->`, reviews)

  return (
    <Grid
      item
      container
      direction="column"
      classes={{ root: classes.reviews }}
      id="reviews"
    >
      {editComment && (
        <ProductReview
          product={product}
          setEditComment={setEditComment}
          reviews={reviews}
        />
      )}
      {reviews.map(review => (
        <ProductReview
          product={product}
          key={review.id}
          review={review}
          reviews={reviews}
        />
      ))}
    </Grid>
  )
}

export default ProductReviews
