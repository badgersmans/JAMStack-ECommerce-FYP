import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { DataGrid } from "@material-ui/data-grid"
import { UserContext, FeedbackContext } from "../../../contexts"

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
  const { user } = useContext(UserContext)
  // console.log(user.favorites)
  const columns = [
    { field: "item", headerName: "Item", width: 250 },
    { field: "variant", headerName: "Variant", width: 275, sortable: false },
    { field: "quantity", headerName: "Quantity", width: 250, sortable: false },
    { field: "price", headerName: "Price", width: 250 },
    { field: "", width: 500, sortable: false },
  ]

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
