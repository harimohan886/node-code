const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema;

const CrmBookingDataSchema = new Schema({
   mobile: String,
   website : String,
   nationality:String,
   due_amount:String,
   email: String,
   date:{
      type: Date,
      default: Date.now,
  },
   time : String,
   address: String,
   state: String,
   mode : String,
   type:String,
   adult: String,
   child : String,
   transaction_id : String,
   sanctuary: String,
   amount : String,
   package_name : String,
   package_type : String,
   booked_customers : String,
});

module.exports = mongoose.model("CrmBookingData", CrmBookingDataSchema.plugin(mongoosastic), 'booking');