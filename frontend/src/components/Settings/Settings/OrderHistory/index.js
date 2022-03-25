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
  "@global": {
    ".MuiDataGrid-root .MuiDataGrid-colCellTitle": {
      fontWeight: 600,
    },
    ".MuiDataGrid-root .MuiDataGrid-iconSeparator": {
      display: "none",
    },
    ".MuiDataGrid-root .MuiDataGrid-colCellTitleContainer": {
      "justify-content": "center",
    },
    ".MuiDataGrid-root .MuiDataGrid-colCellMoving": {
      "background-color": "transparent",
    },
  },
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
}))

function OrderHistory() {
  const classes = useStyles()
  const [orders, setOrders] = useState([])
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

        setOrders(response.data.orders)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  const createDataRows = data =>
    data.map(item => ({
      shipping: `${item.shippingInfo.name}\n${item.shippingAddress.street}\n${item.shippingAddress.city}, ${item.shippingAddress.state}, ${item.shippingAddress.postcode}`,
      order: `#${item.id.slice(item.id.length - 10, item.id.length)}`,
      status: item.status,
      date: item.createdAt,
      total: item.total,
      id: item.id,
    }))

  const columns = [
    { field: "shipping", headerName: "Shipping", flex: 1, sortable: false },
    { field: "order", headerName: "Order", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "date", headerName: "Date", flex: 1, type: "date" },
    { field: "total", headerName: "Total", flex: 1 },
    { field: "", flex: 1.5, sortable: false },
  ]

  const rows = createDataRows(orders)

  return (
    <Grid item classes={{ root: classes.dataGridContainer }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Grid>
  )
}

export default OrderHistory