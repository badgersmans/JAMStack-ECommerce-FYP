import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import Rating from "../../Home/Rating"
import formatMoney from "../../../../utils/formatMoney"
import Sizes from "../../ProductList/Sizes"
import Swatches from "../../ProductList/Swatches"
import QuantityButton from "../../ProductList/QuantityButton"
import { colorIndex } from "../../ProductList/ProductFrameGrid"
import useMediaQuery from "@material-ui/core/useMediaQuery"

import favorite from "../../../images/favorite.svg"
import subscription from "../../../images/subscription.svg"

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: theme.palette.secondary.main,
    height: "45rem",
    width: "35rem",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      height: "58rem",
    },
  },
  center: {
    backgroundColor: theme.palette.primary.main,
    height: "35rem",
    width: "45rem",
    position: "absolute",
    [theme.breakpoints.down("lg")]: {
      width: "40rem",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      height: "48rem",
    },
  },
  infoContainer: {
    marginBottom: "2rem",
  },
  icon: {
    height: "4rem",
    width: "4rem",
    margin: "0.5rem 0.8rem",
  },
  sectionContainer: {
    height: "calc(100% / 3)",
  },
  descriptionContainer: {
    backgroundColor: theme.palette.secondary.main,
    overflowY: "auto",
    padding: "0.5rem 1rem",
    // overflowX: "auto",
  },
  name: {
    color: theme.palette.common.WHITE,
  },
  reviewButton: {
    textTransform: "none",
    marginLeft: "-8px",
  },
  detailsContainer: {
    padding: "0.5rem 1rem",
  },
  chipContainer: {
    marginTop: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
      marginBottom: "1rem",
    },
  },
  chipRoot: {
    height: "3rem",
    width: "auto",
    borderRadius: 50,
  },
  chipLabel: {
    fontSize: "2rem",
  },
  stock: {
    color: theme.palette.common.WHITE,
  },
  sizesAndSwatches: {
    maxWidth: "13rem",
  },
  actionsContainer: {
    padding: "0 1rem",
  },
}))

export const getStockDisplay = (stock, variant) => {
  switch (stock) {
    case undefined:
    case null:
      return "Loading inventory..."
      break
    case -1:
      return "Error loading inventory..."
      break
    default:
      if (stock[variant].quantity === 0) {
        return `Out of stock.`
      } else {
        return `${stock[variant].quantity} currently in stock.`
      }
      break
  }
}

function ProductInfo({
  name,
  description,
  productVariants,
  selectedVariant,
  setSelectedVariant,
  stock,
}) {
  const classes = useStyles()
  const [selectedSize, setSelectedSize] = useState(
    productVariants[selectedVariant].size
  )
  const [selectedColor, setSelectedColor] = useState(null)
  const matchesXS = useMediaQuery(theme => theme.breakpoints.down("xs"))

  const imageIndex = colorIndex(
    { node: { product_variants: productVariants } },
    productVariants[selectedVariant],
    selectedColor
  )

  useEffect(() => {
    setSelectedColor(null)

    const newVariant = productVariants.find(
      variant =>
        variant.size === selectedSize &&
        variant.style === productVariants[selectedVariant].style &&
        variant.color === colors[0]
    )
    setSelectedVariant(productVariants.indexOf(newVariant))
  }, [selectedSize])

  useEffect(() => {
    if (imageIndex !== -1) {
      setSelectedVariant(imageIndex)
    }
  }, [imageIndex])

  const stockDisplay = getStockDisplay(stock, selectedVariant)

  const sizes = []
  const colors = []

  productVariants.map(variant => {
    sizes.push(variant.size)

    // no duplicate colors and only colors for the selected size
    // also colors for the selected variant style (applicable to shirts)
    if (
      !colors.includes(variant.color) &&
      variant.size === selectedSize &&
      variant.style === productVariants[selectedVariant].style
    ) {
      colors.push(variant.color)
    }
  })
  // console.log(selectedVariant)

  return (
    <Grid
      item
      container
      direction="column"
      lg={6}
      justify="center"
      //   alignItems="flex-end"
      classes={{ root: classes.infoContainer }}
    >
      <Grid
        item
        container
        // justify="flex-end"
        // direction="row"
        classes={{ root: classes.background }}
      >
        <Grid item>
          <img
            src={favorite}
            alt="add item to favorite"
            className={classes.icon}
          />
        </Grid>

        <Grid item>
          <img
            src={subscription}
            alt="add item to subscription"
            className={classes.icon}
          />
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction="column"
        classes={{ root: classes.center }}
      >
        <Grid
          item
          container
          justify="space-between"
          direction={matchesXS ? "column" : "row"}
          classes={{
            root: clsx(classes.sectionContainer, classes.detailsContainer),
          }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h1" classes={{ root: classes.name }}>
                  {name.split(" ")[0]}
                </Typography>
              </Grid>

              <Grid item>
                <Rating number={3.5} />
              </Grid>

              <Grid item>
                <Button>
                  <Typography
                    variant="body2"
                    classes={{ root: classes.reviewButton }}
                  >
                    Leave A Review &gt;
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* this is displayed as a row */}
          <Grid item classes={{ root: classes.chipContainer }}>
            <Chip
              label={formatMoney(productVariants[selectedVariant].price)}
              classes={{ root: classes.chipRoot, label: classes.chipLabel }}
            />
          </Grid>
        </Grid>

        <Grid
          item
          container
          classes={{
            root: clsx(classes.sectionContainer, classes.descriptionContainer),
          }}
        >
          <Grid item>
            <Typography variant="h5">Description</Typography>
            <Typography variant="body2">{description}</Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          direction={matchesXS ? "column" : "row"}
          classes={{
            root: clsx(classes.sectionContainer, classes.actionsContainer),
          }}
          justify={matchesXS ? "space-around" : "space-between"}
          alignItems={matchesXS ? "flex-start" : "center"}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item classes={{ root: classes.sizesAndSwatches }}>
                <Sizes
                  sizes={sizes}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                />
                <Swatches
                  colors={colors}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                />
              </Grid>

              <Grid item>
                <Typography variant="h3" classes={{ root: classes.stock }}>
                  {stockDisplay}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <QuantityButton
              stock={stock}
              selectedVariant={selectedVariant}
              name={name}
              productVariants={productVariants}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductInfo
