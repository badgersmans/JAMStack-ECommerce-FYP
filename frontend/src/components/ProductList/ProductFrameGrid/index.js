import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import { navigate } from "gatsby"
import QuickView from "../QuickView"
import clsx from "clsx"

import frame from "../../../images/product-frame-grid.svg"
import square from "../../../images/Square"

const useStyles = makeStyles(theme => ({
  frame: {
    // backgroundImage: `url(${square})`,
    // backgroundPosition: "center",
    // backgroundSize: "cover",
    // backgroundRepeat: "no-repeat",
    height: "25rem",
    width: "25rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      height: "20rem",
      width: "20rem",
    },
    [theme.breakpoints.up("xs")]: {
      height: ({ small }) => (small ? "15rem" : undefined),
      width: ({ small }) => (small ? "15rem" : undefined),
    },
  },
  product: {
    height: "20rem",
    width: "20rem",
    [theme.breakpoints.down("xs")]: {
      height: "15rem",
      width: "15rem",
    },
    [theme.breakpoints.up("xs")]: {
      height: ({ small }) => (small ? "12rem" : undefined),
      width: ({ small }) => (small ? "12rem" : undefined),
    },
  },
  title: {
    backgroundColor: theme.palette.primary.main,
    height: "5rem",
    width: "25rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-0.1rem",
    [theme.breakpoints.down("xs")]: {
      width: "20rem",
    },
    [theme.breakpoints.up("xs")]: {
      width: ({ small }) => (small ? "15rem" : undefined),
    },
  },
  visibility: {
    // display does not render it on the DOM, content shifts
    // display: "none",

    // visibility still renders it on the DOM, content does not shift
    visibility: "hidden",
  },
  frameContainer: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}))

export const colorIndex = (product, variant, selectedColor) => {
  return product.node.product_variants.indexOf(
    product.node.product_variants.filter(
      item =>
        item.color === selectedColor &&
        variant.style === item.style &&
        item.size === variant.size
    )[0]
  )
}

function ProductFrameGrid({
  product,
  variant,
  sizes,
  colors,
  selectedSize,
  selectedColor,
  setSelectedSize,
  setSelectedColor,
  hasStyles,
  disableQuickView,
  small,
  stock,
}) {
  const classes = useStyles({ small })
  const [open, setOpen] = useState(false)
  const matchesMD = useMediaQuery(theme => theme.breakpoints.down("md"))

  if (matchesMD && open) {
    setOpen(false)
  }

  const imageIndex = colorIndex(product, variant, selectedColor)

  const imageURL =
    process.env.GATSBY_STRAPI_URL +
    (imageIndex != -1
      ? product.node.product_variants[imageIndex].images[0].url
      : variant.images[0].url)
  const productName = product.node.name.split(" ")[0]
  return (
    <Grid
      item
      classes={{
        root: clsx(classes.frameContainer, {
          [classes.visibility]: open === true,
        }),
      }}
    >
      <Grid
        container
        direction="column"
        onClick={() =>
          matchesMD || disableQuickView
            ? navigate(
                `/${product.node.category.name.toLowerCase()}/${product.node.name
                  .split(" ")[0]
                  .toLowerCase()}${hasStyles ? `?style=${variant.style}` : ""}`
              )
            : setOpen(true)
        }
      >
        <Grid item classes={{ root: classes.frame }}>
          <img
            src={imageURL}
            alt={product.node.name}
            className={classes.product}
          />
        </Grid>
        <Grid item classes={{ root: classes.title }}>
          <Typography variant="h5">{productName}</Typography>
        </Grid>
      </Grid>
      <QuickView
        open={open}
        setOpen={setOpen}
        url={imageURL}
        name={productName}
        price={variant.price}
        product={product}
        variant={variant}
        sizes={sizes}
        colors={colors}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        setSelectedSize={setSelectedSize}
        setSelectedColor={setSelectedColor}
        hasStyles={hasStyles}
        stock={stock}
        imageIndex={imageIndex}
      />
    </Grid>
  )
}

export default ProductFrameGrid
