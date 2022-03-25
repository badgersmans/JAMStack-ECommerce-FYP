import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Chip from "@material-ui/core/Chip"
import { DataGrid } from "@material-ui/data-grid"
import { makeStyles } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import { UserContext } from "../../../../contexts"
import OrderDetails from "../OrderDetails"
import dayjs from "dayjs"
import formatMoney from "../../../../../utils/formatMoney"
import BackwardsOutline from "../../../../images/BackwardsOutline"
import detailsIcon from "../../../../images/details.svg"

let advancedFormat = require("dayjs/plugin/advancedFormat")
dayjs.extend(advancedFormat)
dayjs().format("Do")

const useStyles = makeStyles(theme => ({
  dataGridContainer: {
    height: "100%",
    width: "100%",
    // marginBottom: "5rem",
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
    ".MuiDataGrid-root .MuiDataGrid-cell": {
      "white-space": "pre-wrap",
      "max-height": "100% !important",
      "line-height": "initial !important",
      padding: "1rem",
      "padding-right": "calc(1rem + 26px)",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "font-weight": 600,
      "border-bottom": "2px solid white",
    },
    ".MuiDataGrid-root .MuiDataGrid-row": {
      "max-height": "100% !important",
    },
    ".MuiDataGrid-root .MuiDataGrid-footer": {
      "margin-top": "-11rem",
    },
    ".MuiTablePagination-caption": {
      color: theme.palette.common.WHITE,
    },
    ".MuiSvgIcon-root": {
      fill: theme.palette.common.WHITE,
    },
    ".MuiDataGrid-root .MuiDataGrid-columnsContainer": {
      "background-color": theme.palette.secondary.main,
      border: "none",
    },
    ".MuiDataGrid-root": {
      border: "none",
    },
    ".MuiDataGrid-root .MuiDataGrid-overlay": {
      bottom: "8rem",
    },
  },
  chipLabel: {
    fontWeight: 600,
  },
  header: {
    height: "8rem",
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
  },
  iconWrapper: {
    height: "4rem",
    width: "4rem",
  },
  // dataGridContainer: {},
  // dataGridContainer: {},
  // dataGridContainer: {},
}))

function OrderHistory({ setSelectedSetting }) {
  const classes = useStyles()
  const [orders, setOrders] = useState([])
  const [open, setOpen] = useState(null)
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
      order: `#${item.id
        .slice(item.id.length - 10, item.id.length)
        .toUpperCase()}`,
      status: item.status,
      date: dayjs(item.createdAt).format("Do MMM YYYY h:mma"),
      total: item.total,
      id: item.id,
    }))

  const columns = [
    { field: "shipping", headerName: "Shipping", width: 350, sortable: false },
    { field: "order", headerName: "Order", width: 350 },
    {
      field: "status",
      headerName: "Status",
      width: 350,
      renderCell: ({ value }) => (
        <Chip label={value} classes={{ label: classes.chipLabel }} />
      ),
    },
    { field: "date", headerName: "Date", width: 250, type: "date" },
    {
      field: "total",
      headerName: "Total",
      width: 250,
      renderCell: ({ value }) => (
        <Chip
          label={formatMoney(value)}
          classes={{ label: classes.chipLabel }}
        />
      ),
    },
    {
      field: "",
      width: 350,
      sortable: false,
      renderCell: () => (
        <IconButton>
          <img src={detailsIcon} alt="order details" />
        </IconButton>
      ),
    },
  ]

  const rows = createDataRows(orders)

  return (
    <Grid item container classes={{ root: classes.dataGridContainer }}>
      <Grid item classes={{ root: classes.header }}>
        <IconButton onClick={() => setSelectedSetting(null)}>
          <div className={classes.iconWrapper}>
            <BackwardsOutline color="#fff" />
          </div>
        </IconButton>
      </Grid>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        onRowClick={e => setOpen(e.row.id)}
        hideFooterSelectedRowCount
      />
      <OrderDetails open={open} setOpen={setOpen} orders={orders} />
    </Grid>
  )
}

export default OrderHistory
