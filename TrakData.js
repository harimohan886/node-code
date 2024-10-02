const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema;
 
const TrakDataSchema = new Schema({
 raw_esn : String,
 from:String,
 raw_datetime : String,
 raw_lng : String,
 raw_lat : String,
 raw_altitude : String,
 raw_speed : String,
 raw_heading : String,
 raw_satcount : String,
 raw_validity : String,
 raw_ioset : String,
 raw_eventidx : String,
 raw_eventcode : String,
 raw_eventdesc : String,
 raw_active_events : String,
 raw_acount : String,
 raw_acc0 : String,
 raw_acc1 : String,
 raw_acc2 : String,
 raw_acc3 : String,
 raw_acc4 : String,
 raw_acc5 : String,
 raw_acc6 : String,
 raw_acc7 : String,
 raw_acc8 : String,
 raw_acc9 : String,
 raw_acc10 : String,
 raw_acc11 : String,
 raw_acc12 : String,
 raw_acc13 : String,
 raw_acc14 : String,
 raw_geofence : String,
 raw_fullraw : String,
 raw_address : String,
 createdAt: {
  type: Date,
  default: Date.now,
},
});

module.exports = mongoose.model("TrakData", TrakDataSchema.plugin(mongoosastic), 'trakdatas');