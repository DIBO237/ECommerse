const mongoose = require("mongoose");

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  purchase_history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "History",
    },
  ],
  user_address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  orders_pending: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],

  coupons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupons",
    },
  ],

  token: {
    type: String,
    default:""
  },


  user_verified: {
    type: Boolean,
    default:false
  },

  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offers",
    },
  ],

  created_At: {
    type: Date,
    required: true,
    default: Date.now,
  },

  updated_At: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
