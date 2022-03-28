import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import { UserContext, FeedbackContext } from "../../../contexts"

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

function Favorites() {
  const classes = useStyles()
  const { user } = useContext(UserContext)

  console.log(user.favorites)

  return <div>Favorites</div>
}

export default Favorites
