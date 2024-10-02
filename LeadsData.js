var mongoose = require('mongoose');
var CrmData = require('./CrmData');
const express = require("express");
const cors = require("cors");

mongoose.connect('mongodb://0.0.0.0:27017/junglecrmnode');

var database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

/* GET home page. */
app.get('/get-tracking-data', function(req, res, next) {
      
    CrmData.findOne({ raw_esn: req.query.raw_esn}, {raw_esn:1,raw_datetime:1,raw_lng:1,raw_lat:1,raw_speed:1,raw_heading:1,raw_active_events:1,raw_eventcode:1,raw_address:1,createdAt:1,_id: 0}, function (err, docs) {
        if (!err) {
            res.json({
                data: docs
            });
        } else {
            console.log('Failed to retrieve the Course List: '+err);
        }
    }).sort({ $natural: -1 });
 
});


app.get('/get-tracking-history', function(req, res, next) {

    var r_dt =  req.query.date ;

    CrmData.find({ raw_esn: req.query.raw_esn, raw_datetime :  {$regex: r_dt} }, {raw_esn:1,raw_datetime:1,raw_lng:1,raw_lat:1,raw_speed:1,raw_heading:1,raw_active_events:1,raw_eventcode:1,raw_address:1,createdAt:1,_id: 0}, 
        function (err, docs) {
            if (!err) {
                res.json({
                    data: docs
                });
            } else {
                console.log('Failed to retrieve the Course List: '+err);
            }
        }).sort({ $natural: -1 }).limit(30);
});

app.get('/get-tracking-report', function(req, res, next) {

    var date_from =  req.query.date_from ;
    var date_to =  req.query.date_to ;

    CrmData.find({ $and: [{"raw_esn": req.query.raw_esn}, {"raw_datetime": {$gte: date_from, $lte: date_to}}]},
        {raw_esn:1,raw_datetime:1,raw_lng:1,raw_lat:1,raw_altitude:1,raw_eventdesc:1,raw_speed:1,raw_heading:1,raw_active_events:1,raw_eventcode:1,raw_address:1,createdAt:1,_id: 0}, 
        function (err, docs) {
            if (!err) {
                res.json({
                    data: docs
                });
            } else {
                console.log('Failed to retrieve the Course List: '+err);
            }
        }).sort({ $natural: -1 }).limit(100);

});



app.get('/tracking-report-data', async (req,res) => {
    var page = parseInt(req.query.page);
    var size = parseInt(req.query.size);
    var query = {}
    if(page < 0 || page === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response);
    }
    query.skip = size * (page - 1);
    query.limit = size;
    var date_from =  req.query.date_from ;
    var date_to =  req.query.date_to ;

    var  totalPosts = await CrmData.countDocuments({raw_esn: req.query.raw_esn, raw_datetime: {$gte: date_from, $lte: date_to}});

    CrmData.find({raw_esn: req.query.raw_esn, raw_datetime: {$gte: date_from, $lte: date_to}},
        {raw_esn:1,raw_datetime:1,raw_lng:1,raw_lat:1,raw_altitude:1,raw_eventdesc:1,raw_speed:1,raw_heading:1,raw_active_events:1,raw_eventcode:1,raw_address:1,createdAt:1,_id: 0},
        query,function(err,data) {
            if(err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = {"error": false, "message": 'data fetched', 'data': data, 'page': page, 'total': totalPosts };
            }
            return res.json(response);
        }).sort({ $natural: -1 });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});