import mongoose, { connect } from "mongoose";

connect(
  process.env.ENV === "DEV" ? process.env.DB_DEV_URL! : process.env.DB_PROD_URL!
)
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.log(err));
