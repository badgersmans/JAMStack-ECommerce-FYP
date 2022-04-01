import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import { UserContext, FeedbackContext } from "../../../../contexts"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"
import SettingsDataGrid from "../../SettingsDataGrid"

const useStyles = makeStyles(theme => ({
  // something: {},
  // something: {},
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

  const columns = [
    { field: "details", headerName: "Details", width: 250, sortable: false },
    { field: "item", headerName: "Item", width: 250, sortable: false },
    { field: "quantity", headerName: "Quantity", width: 250, sortable: false },
    {
      field: "frequency",
      headerName: "Frequency",
      width: 250,
      sortable: false,
    },
    { field: "next order", headerName: "Next Order", width: 250 },
    { field: "total", headerName: "Total", width: 250 },
    { field: "", width: 250, sortable: false },
  ]

  return (
    <SettingsDataGrid
      rows={[]}
      columns={columns}
      setSelectedSetting={setSelectedSetting}
    />
  )
}

export default Subscriptions
