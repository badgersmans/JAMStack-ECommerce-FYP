import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import formatMoney from "../../../../utils/formatMoney"
import Chip from "@material-ui/core/Chip"
import Sizes from "../../ProductList/Sizes"
import Swatches from "../../ProductList/Swatches"
import QuantityButton from "../../ProductList/QuantityButton"
import Delete from "../../../images/Delete"
import axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import { DataGrid } from "@material-ui/data-grid"
import { UserContext, FeedbackContext } from "../../../contexts"
import { setSnackbar } from "../../../contexts/actions/feedback-actions"

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: "100%",
    width: "100%",
  },
  image: {
    height: "10rem",
    width: "10rem",
  },
  name: {
    color: theme.palette.common.WHITE,
  },
  chipRoot: {
    height: "3rem",
    width: "10rem",
    borderRadius: 50,
  },
  deleteWrapper: {
    height: "2rem",
    width: "2rem",
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function Favorites() {
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const [selectedVariants, setSelectedVariants] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedColors, setSelectedColors] = useState({})
  const { user } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  // console.log(user.favorites)

  const createRows = data =>
    data.map(item => ({
      item: {
        name: item.variants[0].product.name.split(" ")[0],
        image: item.variants[0].images[0].url,
      },
      variant: { all: item.variants, current: item.product_variant },
      quantity: item.variants,
      price: item.variants[0].price,
      // id is the favorite id
      id: item.id,
    }))

  const setSelectedHelper = (selectedFunction, existingValues, value, row) => {
    selectedFunction({ ...existingValues, [row]: value })
  }

  const columns = [
    {
      field: "item",
      headerName: "Item",
      width: 250,
      renderCell: ({ value }) => (
        <Grid container direction="column">
          <Grid item>
            <img
              src={`${process.env.GATSBY_STRAPI_URL}${value.image}`}
              alt={value.name}
              className={classes.image}
            />
          </Grid>

          <Grid item>
            <Typography variant="h3" classes={{ root: classes.name }}>
              {value.name}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "variant",
      headerName: "Variant",
      width: 275,
      sortable: false,
      renderCell: ({ value, row }) => {
        let sizes = []
        let colors = []

        value.all.map(variant => {
          sizes.push(variant.size)

          // if color not already on the list
          if (
            !colors.includes(variant.color) &&
            variant.size === selectedSizes[row.id] &&
            variant.style === value.current.style
          ) {
            colors.push(variant.color)
          }
        })

        return (
          <Grid container direction="column">
            <Sizes
              sizes={sizes}
              selectedSize={selectedSizes[row.id]}
              setSelectedSize={size =>
                setSelectedHelper(setSelectedSizes, selectedSizes, size, row.id)
              }
            />
            <Swatches
              colors={colors}
              selectedColor={selectedColors[row.id]}
              setSelectedColor={color =>
                setSelectedHelper(
                  setSelectedColors,
                  selectedColors,
                  color,
                  row.id
                )
              }
            />
          </Grid>
        )
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <QuantityButton
          stock={[{ quantity: value[0].quantity }]}
          variants={value}
          selectedVariant={0}
          name={value[0].product.name.split(" ")[0]}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 250,
      renderCell: ({ value }) => (
        <Chip classes={{ root: classes.chipRoot }} label={formatMoney(value)} />
      ),
    },
    {
      field: "",
      width: 500,
      sortable: false,
      renderCell: ({ value }) => (
        <IconButton>
          <span className={classes.deleteWrapper}>
            <Delete />
          </span>
        </IconButton>
      ),
    },
  ]

  console.log(selectedSizes)

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_STRAPI_URL}/favorites/userFavorites`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setProducts(response.data)
      })
      .catch(error => {
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem getting your favorite products, please refresh the page",
          })
        )
      })
  }, [])

  const rows = createRows(products)
  console.log(`products ->`, products)
  return (
    <Grid item container classes={{ root: classes.mainContainer }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        hideFooterSelectedRowCount
      />
    </Grid>
  )
}

export default Favorites
