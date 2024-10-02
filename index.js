const express = require('express'); 
const app = express();
const port = 5009;
const bodyParser = require('body-parser');
const path = require('path')
const dotenv = require("dotenv").config();
const axios = require('axios');
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

var mongoose = require('mongoose');
const CrmData = require('./CrmData');
const CrmBookingData = require('./CrmBooking');

mongoose.connect(process.env.MONGO_URL);

mongoose.set('strictQuery', true);

var database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));

const k = 2;
const result = add(2,4);
function add(a,b) {
  return a+b;
}

console.log(result);

app.get('/api/getleadDetails/:id', (req,res) => {
    try {

      const results = CrmData.find({ mobile:req.params.id }).then(result => {
           if(result) {
              return res.status(200).send({
                status: 200,
                result: result
              })
           }
      }).catch(error => {
         console.log("Error: ", error);
      })

    } catch(err) {
       res.status(201).send({ status:201, error: err })
    }
});

app.post('/api/save-lead', (req, res) => {

      var crmdata = new CrmData({
          name : req.body.name,
          email : req.body.email,
          mobile : req.body.mobile,
          website : req.body.website,
          address: req.body.address,
          state: req.body.state,
          assigned_to : null,
          custom_data: req.body.custom_data,
          booking_type: req.body.type,
          lead_status: req.body.payment_status,
          payment_status: req.body.payment_status
      });

      crmdata.save(function (err, crmdata) {
          if (err) return console.error(err);
          sendToCRM(crmdata, 'save')
      });

     res.status(200)
      .send({
        success: true,
        message: "Lead saved successfully!",
        data: crmdata,
      });

 });

 app.post('/api/update-lead-status', (req,res) => {
       var crmdata = new CrmData({
          name : req.body.name,
          email : req.body.email,
          mobile : req.body.mobile,
          address: req.body.address,
          website : req.body.website,
          state: req.body.state,
          assigned_to : null,
          custom_data: req.body.custom_data,
          booking_type: req.body.booking_type,
          lead_status: req.body.payment_status,
          payment_status: req.body.payment_status
      });

      crmdata.save(function (err, crmdata) {
          if (err) return console.error(err);
          sendToCRM(crmdata , 'update-lead-status');
      });

      res.status(200)
      .send({
        success: true,
        message: "Lead saved successfully!",
        data: crmdata,
      });
 });

    app.post('/api/update-lead-data', async (req,res) => {

         const data = {
        'name': req.body.name,
        'mobile': req.body.mobile,
        'email': req.body.email,
        'website': req.body.website,
        'custom_data': req.body.custom_data
      }

        sendToCRM(data , 'update-lead-data');

        res.status(200)
        .send({
          success: true,
          message: "Lead saved successfully!",
          data: null,
        });
    });

 app.post('/api/booking', (req, res) => {

  var CrmBooking = new CrmBookingData({
      mobile: req.body.mobile,
      address: req.body.address,
      state: req.body.state,
      website : req.body.website,
      date : req.body.date,
      type : req.body.type ? req.body.type : 'safari',
      time : req.body.time,
      mode : req.body.mode,
      adult: req.body.adult,
      child: req.body.child,
      package_name : req.body.package_name ? req.body.package_name : '',
      package_type : req.body.package_type ? req.body.package_type : '',
      due_amount : req.body.due_amount ? req.body.due_amount : '',
      nationality : req.body.nationality ? req.body.nationality : '',
      transaction_id: req.body.transaction_id,
      sanctuary: req.body.sanctuary,
      amount: req.body.amount,
      booked_customers: req.body.booked_customers
  });

    CrmBooking.save(function (err, result) {
      if (err) return console.error(err);
      sendToCRM(result,'direct-booking');
    });

   res.status(200)
    .send({
      success: true,
      message: "Booking saved successfully!",
      data: CrmBooking,
    });

  });

  app.post('/api/ranthambore-booking', (req, res) => {

    var CrmBooking = new CrmBookingData({
        mobile: req.body.mobile,  
        address: req.body.address,
        state: req.body.state,
        website : req.body.website,
        type : req.body.type ? req.body.type : 'safari',
        email : req.body.email,
        date : req.body.date,
        time : req.body.time,
        mode : req.body.mode,
        adult: req.body.adult,
        child: req.body.child,
        transaction_id: req.body.transaction_id,
        sanctuary: req.body.sanctuary,
        amount: req.body.amount,
        booked_customers: req.body.booked_customers
    });
  
      CrmBooking.save(function (err, result) {
        if (err) return console.error(err);
        sendToCRM(result,'ranthambore-booking');
      });
  
     res.status(200)
      .send({
        success: true,
        message: "Booking saved successfully!",
        data: CrmBooking,
      });
  
    });

  
  async function sendToCRM(data,action) {

    if(action === 'save') {
            const response = await axios.post(`${process.env.BASE_URL_CRM}/save-lead`, data, {
              withCredentials: true,
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
              }
            },{
              auth: {
                username: process.env.CRM_USERNAME,
                password: process.env.CRM_PASSWORD
            }
            }).then(result => {
              console.log(result);
            }).catch(err => {
              console.log("Error: ",err);
            });
    } else if(action === 'update-lead-status') {
          const response = await axios.post(`${process.env.BASE_URL_CRM}/update-lead-status`, data, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          }).then(result => {
               
          }).catch(err => {
            console.log("Error: ",err);
          });

    } else if(action === 'direct-booking') {
        const address_data = {
            'mobile': data.mobile,
            'address': data.address,
            'state': data.state
        }

      axios.post(`${process.env.BASE_URL_CRM}/save-address`, address_data, 
       
      {
        withCredentials: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      },{
        auth: {
          username: process.env.CRM_USERNAME,
          password: process.env.CRM_PASSWORD
      }
      }
      
      ).then(res => {
          const response = axios.post(`${process.env.BASE_URL_CRM}/direct-booking`, data, {
            withCredentials: true,
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          },{
            auth: {
              username: process.env.CRM_USERNAME,
              password: process.env.CRM_PASSWORD
          }
          }).then(result => {
                console.log("Booking Result", result);
          }).catch(err => {
            console.log("Error: ",err);
          });

      }).catch(err => {});  
        

    } else if(action === 'update-lead-data') {
      console.log("Lead Data", data);
      const response = await axios.post(`${process.env.BASE_URL_CRM}/update-lead-data`, data, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).then(result => {
           console.log("result:update lead data", result);
      }).catch(err => {
        console.log("Error on update lead data: ",err);
      });
    } else if(action === 'ranthambore-booking') {
      const address_data = {
          'mobile': data.mobile,
          'address': data.address,
          'state': data.state
      }

    axios.post(`${process.env.BASE_URL_CRM}/save-address`, address_data, 
     
    {
      withCredentials: true,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    },{
      auth: {
        username: process.env.CRM_USERNAME,
        password: process.env.CRM_PASSWORD
    }
    }
    
    ).then(res => {
        const response = axios.post(`${process.env.BASE_URL_CRM}/ranthambore-booking`, data, {
          withCredentials: true,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        },{
          auth: {
            username: process.env.CRM_USERNAME,
            password: process.env.CRM_PASSWORD
        }
        }).then(result => {
              console.log("Booking Result", result);
        }).catch(err => {
          console.log("Error: ",err);
        });

    }).catch(err => {});  
    }   
  }

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});