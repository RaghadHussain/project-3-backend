const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase:true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    bio:{
      type: String,
      trim: true,
      maxlength: 250,
    },
    profileImage:{
      type: String,
    },
    followers:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User'
    },
    followings:{
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
