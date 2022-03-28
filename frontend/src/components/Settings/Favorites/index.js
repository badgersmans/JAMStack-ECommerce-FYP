import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
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
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
  // something: {},
}))

function Favorites() {
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const { user } = useContext(UserContext)
  const { dispatchFeedback } = useContext(FeedbackContext)
  // console.log(user.favorites)
  const columns = [
    { field: "item", headerName: "Item", width: 250 },
    { field: "variant", headerName: "Variant", width: 275, sortable: false },
    { field: "quantity", headerName: "Quantity", width: 250, sortable: false },
    { field: "price", headerName: "Price", width: 250 },
    { field: "", width: 500, sortable: false },
  ]

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

  console.log(`products ->`, products)
  return (
    <Grid item container classes={{ root: classes.mainContainer }}>
      <DataGrid
        rows={[]}
        columns={columns}
        pageSize={5}
        hideFooterSelectedRowCount
      />
    </Grid>
  )
}

export default Favorites
