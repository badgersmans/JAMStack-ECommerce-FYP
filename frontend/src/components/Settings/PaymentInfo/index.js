import React, { useState, useEffect } from "react"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import { makeStyles } from "@material-ui/core/styles"
import Slots from "../Slots"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

import cardIcon from "../../../images/card.svg"

const useStyles = makeStyles(theme => ({
  icon: {
    marginBottom: "3rem",
    width: "4rem",
    height: "3rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
    },
  },
  cardNumber: {
    color: theme.palette.common.WHITE,
    marginBottom: "5rem",
  },
  deleteCard: {
    backgroundColor: theme.palette.common.WHITE,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: "2rem",
    "&:hover": {
      backgroundColor: theme.palette.common.WHITE,
    },
  },
  deleteCardText: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    fontFamily: "Philosopher",
    fontStyle: "italic",
  },
  paymentContainer: {
    display: ({ isCheckout, selectedStep, stepNumber }) =>
      isCheckout && selectedStep !== stepNumber ? "none" : "flex",
    borderLeft: ({ isCheckout }) =>
      isCheckout ? 0 : `4px solid ${theme.palette.common.WHITE}`,
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: "30rem",
      borderLeft: 0,
    },
  },
  slotsContainer: {
    position: "absolute",
    bottom: 0,
  },
  switchContainer: {
    marginRight: 4,
  },
  switchText: {
    color: theme.palette.common.WHITE,
    fontWeight: 600,
  },
  form: {
    width: "75%",
    borderBottom: `2px solid ${theme.palette.common.WHITE}`,
    height: "2rem",
    marginTop: "-1rem",
  },
  //   form: {},
  //   form: {},
  //   cardNumber: {},
}))

function PaymentInfo({
  user,
  slot,
  setSlot,
  isCheckout,
  saveCard,
  setSaveCard,
  setCardError,
  selectedStep,
  stepNumber,
  setCard,
}) {
  const classes = useStyles({ isCheckout, selectedStep, stepNumber })
  const stripe = useStripe()
  const elements = useElements()
  const card =
    user.username === "Guest"
      ? { last4: "", brand: "" }
      : user.paymentMethods[slot]

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) return
  }

  const handleCardChange = async event => {
    if (event.complete) {
      const cardElement = elements.getElement(CardElement)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      setCard({
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
      })
      setCardError(false)
      // console.log("valid")
    } else {
      setCardError(true)
      // console.log("invalid")
    }
  }

  const cardWrapper = (
    <form onSubmit={handleSubmit} className={classes.form}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "20px",
              fontFamily: "Montserrat",
              color: "#FFF",
              iconColor: "#FFF",
              "::placeholder": {
                color: "#FFF",
              },
            },
          },
        }}
        onChange={handleCardChange}
      />
    </form>
  )

  useEffect(() => {
    // check to make sure user is logged in and currently in checkout process
    if (!isCheckout || !user.jwt) return

    // if there is a saved payment method
    if (user.paymentMethods[slot].last4 !== "") {
      setCard(user.paymentMethods[slot])
      setCardError(false)
    } else {
      // no saved payment method
      setCard({ brand: "", last4: "" })
      setCardError(true)
    }
  }, [slot])

  return (
    <Grid
      item
      container
      direction="column"
      lg={isCheckout ? 12 : 6}
      xs={12}
      alignItems="center"
      justify="center"
      classes={{ root: classes.paymentContainer }}
    >
      <Grid item>
        <img src={cardIcon} alt="payment info" className={classes.icon} />
      </Grid>

      <Grid item container justify="center">
        {isCheckout && !card.last4 ? cardWrapper : null}
        <Grid item>
          <Typography
            variant="h3"
            classes={{ root: classes.cardNumber }}
            align="center"
          >
            {card.last4
              ? `${card.brand.toUpperCase()} **** **** **** ${card.last4}`
              : isCheckout
              ? null
              : "Add your cards during checkout"}
          </Typography>
        </Grid>
        {card.last4 && (
          <Grid item>
            <Button variant="contained" classes={{ root: classes.deleteCard }}>
              <Typography
                variant="h6"
                classes={{ root: classes.deleteCardText }}
              >
                Delete Saved Cards
              </Typography>
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid
        item
        container
        justify="space-between"
        classes={{ root: classes.slotsContainer }}
      >
        <Slots slot={slot} setSlot={setSlot} noLabel />

        {isCheckout && user.username !== "Guest" && (
          <Grid item>
            <FormControlLabel
              classes={{
                root: classes.switchContainer,
                label: classes.switchText,
              }}
              label="Save card for future use"
              labelPlacement="start"
              control={
                <Switch
                  checked={saveCard}
                  onChange={() => setSaveCard(!saveCard)}
                  color="secondary"
                />
              }
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default PaymentInfo
