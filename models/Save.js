const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema(
  {
   user:{
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User'
       },
       post:{
        type: mongoose.Schema.Types.ObjectId,
           ref: 'Post'
       }
  },
  { timestamps: true },
);

const Save = mongoose.model("Save", saveSchema)

module.exports = Save
