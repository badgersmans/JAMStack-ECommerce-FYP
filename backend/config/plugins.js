module.exports = ({ env }) => ({
  email: {
    provider: "postmark",
    providerOptions: {
      apiKey: env("POSTMARK_EMAIL_API_KEY"),
    },
    settings: {
      defaultMessageStream: "fyp-emails",
      defaultFrom: "example@email.com",
      defaultTo: "example@email.com",
      // defaultReplyTo: "code@ijs.to",
      // defaultVariables: {
      //   sentBy: 'strapi',
      // },
    },
  },
});
