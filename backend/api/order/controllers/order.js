"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const GUEST_ID = "623413aeb5add55cc452bf11";

module.exports = {
  async process(ctx) {
    const {
      items,
      total,
      shippingOption,
      idempotencyKey,
      storedIntent,
      email,
    } = ctx.request.body;

    let serverTotal = 0;
    let unavailable = [];

    // wait for everything to complete...
    await Promise.all(
      items.map(async (clientItem) => {
        const serverItem = await strapi.services["product-variant"].findOne({
          id: clientItem.variant.id,
        });

        // make sure quantity is available (item is in stock)
        if (serverItem.quantity < clientItem.quantity) {
          unavailable.push({
            id: serverItem.id,
            quantity: serverItem.quantity,
          });
        }
        // calculate total price at server side
        serverTotal += serverItem.price * clientItem.quantity;
      })
    );

    // this is only executed after everything in Promise.all has completed SUCCESSFULLY
    const shippingOptions = [
      { label: "FREE SHIPPING", price: 0 },
      { label: "2-DAY SHIPPING", price: 5 },
      { label: "OVERNIGHT SHIPPING", price: 50 },
    ];

    //   check shipping information is not tampered from client
    const shippingValid = shippingOptions.find(
      (option) =>
        option.label === shippingOption.label &&
        option.price === shippingOption.price
    );

    //   find() returns undefined if not found (meaning shipping info has been tampered)
    if (
      shippingValid === undefined ||
      (serverTotal * 1.14 + shippingValid.price).toFixed(2) !== total
    ) {
      ctx.send({ error: "Invalid Cart" }, 400);
      //   there are some products unavailable
    } else if (unavailable.length > 0) {
      ctx.send({ unavailable }, 409);
    } else {
      if (storedIntent) {
        // update the intent
        // mutiply by 100 because stripe processes money in cents
        const update = await stripe.paymentIntents.update(
          storedIntent,
          { amount: total * 100 },
          { idempotencyKey }
        );

        ctx.send({ client_secret: update.client_secret, intentID: update.id });
      } else {
        // generate new paymentIntent
        const intent = await stripe.paymentIntents.create(
          {
            amount: total * 100,
            currency: "MYR",
            customer: ctx.state.user ? ctx.state.user.stripeID : undefined,
            receipt_email: email,
          },
          { idempotencyKey }
        );
        ctx.send({ client_secret: intent.client_secret, intentID: intent.id });
      }
    }
  },

  async finalize(ctx) {
    console.log(`ctx.request.body ->`, ctx.request.body);
    const {
      shippingAddress,
      billingAddress,
      shippingInfo,
      billingInfo,
      shippingOption,
      subtotal,
      tax,
      total,
      items,
      transaction,
      saveCard,
      cardSlot,
      paymentMethod,
    } = ctx.request.body;

    let customerOrder;

    // check if authenticated user
    if (ctx.state.user) {
      customerOrder = ctx.state.user.id;
    } else {
      // otherwise it is a guest user
      customerOrder = GUEST_ID;
    }

    // wait for everything to complete...
    await Promise.all(
      items.map(async (clientItem) => {
        const serverItem = await strapi.services["product-variant"].findOne({
          id: clientItem.variant.id,
        });

        // minus the stock quantity
        await strapi.services["product-variant"].update(
          { id: clientItem.variant.id },
          { quantity: serverItem.quantity - clientItem.quantity }
        );
      })
    );

    // if logged in and user wants to save card
    if (saveCard && ctx.state.user) {
      let newPaymentMethods = [...ctx.state.user.paymentMethods];

      newPaymentMethods[cardSlot] = paymentMethod;

      await strapi.plugins["users-permissions"].services.user.edit(
        { id: customerOrder },
        { paymentMethods: newPaymentMethods }
      );
    }

    let order = await strapi.services.order.create({
      shippingAddress,
      billingAddress,
      shippingInfo,
      billingInfo,
      shippingOption,
      subtotal,
      tax,
      total,
      items,
      transaction,
      user: customerOrder,
      paymentMethod,
    });

    order = sanitizeEntity(order, { model: strapi.models.order });

    // overwrite guest user to avoid leaking other guest checkout info
    if (order.user.username === "Guest") {
      order.user = { username: "Guest" };
    }
    // finally send the order.
    ctx.send({ order }, 200);
  },
};
