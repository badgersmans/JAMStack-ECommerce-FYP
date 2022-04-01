"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */
const dayjs = require("dayjs");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  // everyday at 8am
  "0 8 * * *": async () => {
    const subscriptionsToday = await strapi.services.subscription.find({
      next_delivery: dayjs().format(),
    });

    await Promise.allSettled(
      subscriptionsToday.map(async (subscription) => {
        // get user all payment methods
        const paymentMethods = await stripe.paymentMethods.list({
          customer: subscription.user.stripeID,
          type: "card",
        });

        // get the actual card to be charged
        const paymentMethod = paymentMethods.data.find(
          (method) => method.card.last4 === subscription.paymentMethod.last4
        );

        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(subscription.variant.price * 0.14 * 100),
            currency: "myr",
            customer: subscription.user.stripeID,
            payment_method: paymentMethod.id,
            off_session: true,
            confirm: true,
          });
        } catch (error) {
          // notify customer that payment failed, ask them to enter new information
          console.log(error);
        }
      })
    );
  },

  // everyday at 8am
  // "*/1 * * * * *": async (date) => {
  // console.log(date);
  // },
};
