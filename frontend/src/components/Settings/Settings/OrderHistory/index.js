import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"
import { UserContext } from "../../../../contexts"

const useStyles = makeStyles(theme => ({
  dataGridContainer: {
    height: "100%",
    width: "100%",
  },
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
}))

function OrderHistory() {
  const classes = useStyles()
  const [order, setOrder] = useState([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    axios
      .get(`${process.env.GATSBY_STRAPI_URL}/orders/history`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  const columns = [
    { field: "shipping", headerName: "Shipping", flex: 1 },
    { field: "order", headerName: "Order", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "total", headerName: "Total", flex: 1 },
  ]

  const rows = [
    // { shipping: "Law" },
    // { order: "Shawn" },
    // { status: "Shawn" },
    // { date: "Shawn" },
    // { total: "Shawn" },
  ]

  return (
    <Grid item classes={{ root: classes.dataGridContainer }}>
      <DataGrid rows={rows} columns={columns} pageSize={1} />
    </Grid>
  )
}

export default OrderHistory
