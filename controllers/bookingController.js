import bookingModel from "../models/bookingModel.js";
import notificationsModel from "../models/notificationsModel.js";
import moment from 'moment';
import transporter from "../config/nodemailer.js";
import userModel from "../models/userModel.js";
import {
  BOOKING_INVITATION_TEMPLATE
} from "../config/notiEmailTemplate.js";
import {
  BOOKING_RESPONSE_TEMPLATE
} from "../config/respondEmailTemplate.js";

async function createBooking(req, res) {
  try {

    req.body.status = "pending";
    req.body.bookedTo = req.body.bookedToId;
    req.body.bookedBy = req.body.bookedById;

    const booking = new bookingModel(req.body)
    await booking.save()

    const notifications = new notificationsModel({
      title: "Meeting",
      description: "A new meeting is set up for you.",
      targetUser: req.body.bookedTo,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await notifications.save();

    
    const user = await userModel.findById(req.body.bookedToId);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Booking Status",
      text: `Hello ${user.name}, a new booking has been created for you`,
      html: BOOKING_INVITATION_TEMPLATE.replace("{{name}}", user.name).replace(
              "{{email}}",
              user.email
      ),
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

async function getCurrUsrBookingByStaffId(req, res) {
  try {
    let bookings = await bookingModel
      .find({ bookedTo: req.params.id, bookedBy: req.user.id.toString() })
      .populate("bookedBy")
      .populate("bookedTo");


    bookings.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt));

    
    bookings = bookings.map((val)=>{
      if(val.status === "accepted" && moment().isAfter(moment(val.endTime))){
        val.status = "completed";
      }

      return val;
    })


    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getById(req, res) {
  try {
    let booking = await bookingModel
      .findById(req.params.id)
      .populate("bookedBy")
      .populate("bookedTo");


    booking = booking.map((val)=>{
      if(val.status === "accepted" && moment().isAfter(moment(val.endTime))){
        val.status = "completed";
      }

      return val;
    })


    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateById(req, res) {
  try {
    req.body.updatedAt = new Date();
    const booking = await bookingModel.findByIdAndUpdate(req.params.id, req.body,{ new: true })


    const notifications = new notificationsModel({
      title: "Meeting",
      description: "A staff has reponded to your booking.",
      targetUser: booking.bookedBy,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await notifications.save();

    const bookedByUser = await userModel.findById(booking.bookedBy);

    const bookedToUser = await userModel.findById(booking.bookedTo);


    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: bookedByUser.email,
      subject: "Booking Status",
      text: `Hello ${bookedByUser.name}, ${bookedToUser.name} has responded to your booking.`,
      html: BOOKING_RESPONSE_TEMPLATE.replace("{{bookedByName}}", bookedByUser.name).replace(
              "{{bookedToName}}",
              bookedToUser.name
      ),
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getByStaffId(req, res) {
  try {
    let bookings = await bookingModel
      .find({bookedTo: req.params.id})
      .populate("bookedBy")
      .populate("bookedTo")

    bookings = bookings.map((val)=>{
      if(val.status === "accepted" && moment().isAfter(moment(val.endTime))){
        val.status = "completed";
      }

      return val;
    })

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getBySuperiorId(req, res) {
  try {
    let bookings = await bookingModel
      .find({bookedBy: req.params.id})
      .populate("bookedBy")
      .populate("bookedTo")


    bookings = bookings.map((val)=>{
      if(val.status === "accepted" && moment().isAfter(moment(val.endTime))){
        val.status = "completed";
      }

      return val;
    })

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export { createBooking, getCurrUsrBookingByStaffId, getById, updateById, getByStaffId, getBySuperiorId };
