module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  // url: env("", "https://a3c9-121-122-85-84.ngrok.io"),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "1f0dcde13c6a0d84a8df10e9df4250c3"),
    },
  },
});
