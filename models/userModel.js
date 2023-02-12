const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please, add a name!"],
    },
    email: {
      type: String,
      required: [true, "Please, add an email!"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email!",
      ],
    },
    password: {
      type: String,
      required: [true, "Please, add a Password!"],
      minLength: [6, "Password must have at least 6 characters!"],
      // maxLength: [23, "Password must not have more thant 23 characters!"],
    },
    photo: {
      type: String,
      required: [true, "Please, add a Photo!"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+1",
    },
    bio: {
      type: String,
      default: "Bio...",
      maxLength: [250, "Bio must not have more thant 250 characters!"],
    },
  },
  { timestamps: true }
);

// Encrypt Password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
