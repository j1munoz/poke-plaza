//A Mongoose schema/model for a User collection.
//Not needed anymore, since we are using native MongoDB driver approach
//im scared to delete

import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
  },
  { timestamps: true },
);

export default models.User || model("User", UserSchema);
