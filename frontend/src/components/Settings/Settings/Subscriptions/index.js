import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import { UserContext, FeedbackContext } from "../../../../contexts"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"
import SettingsDataGrid from "../../SettingsDataGrid"
import formatMoney from "../../../../../utils/formatMoney"
import QuantityButton from "../../../ProductList/QuantityButton"

const useStyles = makeStyles(theme => ({
  bold: {
    fontWeight: 600,
  },
  productImage: {
    height: "10rem",
    width: "10rem",
  },
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function Subscriptions({ setSelectedSetting }) {
  const classes = useStyles()
  const { user, dispatchUser } = useContext(UserContext)
  const { feedback, dispatchFeedback } = useContext(FeedbackContext)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_STRAPI_URL}/subscriptions/me`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        setSubscriptions(response.data)
      })
      .catch(error => {
        console.error(error)
        dispatchFeedback(
          setSnackbar({
            status: "error",
            message:
              "There was a problem getting your subscriptions, please refresh the page.",
          })
        )
      })
  }, [])

  console.log(`subscriptions ->`, subscriptions)

  const createRows = data =>
    data.map(
      ({
        shippingInfo,
        shippingAddress,
        billingInfo,
        billingAddress,
        paymentMethod,
        productName,
        product_variant,
        quantity,
        frequency,
        next_delivery,
        id,
      }) => ({
        details: {
          shippingInfo,
          shippingAddress,
          billingInfo,
          billingAddress,
          paymentMethod,
        },
        item: { productName, product_variant },
        quantity: { quantity, productName, product_variant },
        frequency,
        next_delivery,
        total: formatMoney(product_variant.price * 1.14),
        id,
      })
    )

  const columns = [
    {
      field: "details",
      headerName: "Details",
      width: 350,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="body2" classes={{ root: classes.bold }}>
          {`${value.shippingInfo.name}`}
          <br />
          {`${value.shippingAddress.street}`}
          <br />
          {`${value.shippingAddress.city}, ${value.shippingAddress.state}, ${value.shippingAddress.postcode}`}
        </Typography>
      ),
    },
    {
      field: "item",
      headerName: "Item",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <img
              src={`${process.env.GATSBY_STRAPI_URL}${value.product_variant.images[0].url}`}
              alt={value.productName}
              className={classes.productImage}
            />
          </Grid>

          <Grid item>
            <Typography variant="body2" classes={{ root: classes.bold }}>
              {value.productName}
            </Typography>
          </Grid>
        </Grid>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 250,
      sortable: false,
      renderCell: ({ value }) => (
        <QuantityButton
          stock={[{ quantity: value.product_variant.quantity }]}
          variants={value.product_variant}
          selectedVariant={0}
          name={value.productName}
          hideCartButton
          round
        />
      ),
    },

    {
      field: "frequency",
      headerName: "Frequency",
      width: 250,
      sortable: false,
    },
    { field: "next_delivery", headerName: "Next Order", width: 250 },
    { field: "total", headerName: "Total", width: 250 },
    { field: "", width: 250, sortable: false },
  ]

  const rows = createRows(subscriptions)
  //   console.log(`rows ->`, rows)
  return (
    <SettingsDataGrid
      rows={rows}
      columns={columns}
      setSelectedSetting={setSelectedSetting}
      rowsPerPage={2}
    />
  )
}

export default Subscriptions
