"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  async average(id) {
    const product = await strapi.services.product.findOne({ id });

    const total = product.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    console.log(`total? ->`, total);

    const average = total / product.reviews.length;
    console.log(`average? ->`, average);

    await strapi.services.product.update(
      { id },
      { averageRating: Math.round(average * 2) / 2 }
    );
  },
};
