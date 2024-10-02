const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema;

const CrmDataSchema = new Schema({
   name : String,
   email:String,
   mobile : String,
   website : String,
   booking_type: String,
   address: String,
   state: String,
   custom_data: String,
   source : {
    type: String,
    default: 'website'
   },
   lead_status : String,
   payment_status: String,
   createdAt: {
      type: Date,
      default: Date.now,
  },
});

module.exports = mongoose.model("CrmData", CrmDataSchema.plugin(mongoosastic), 'leads');