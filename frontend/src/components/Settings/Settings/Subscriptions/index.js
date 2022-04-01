import React, { useState, useEffect, useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import axios from "axios"
import { UserContext, FeedbackContext } from "../../../../contexts"
import { setSnackbar } from "../../../../contexts/actions/feedback-actions"

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

function Subscriptions() {
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
  return <div>subscriptions...</div>
}

export default Subscriptions
