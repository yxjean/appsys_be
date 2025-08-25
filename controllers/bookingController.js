import bookingModel from "../models/bookingModel.js";
import notificationsModel from "../models/notificationsModel.js";

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


    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

async function getCurrUsrBookingByStaffId(req, res) {
  try {
    const bookings = await bookingModel
      .find({ bookedTo: req.params.id, bookedBy: req.user.id.toString() })
      .populate("bookedBy")
      .populate("bookedTo");


    bookings.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt));


    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getById(req, res) {
  try {
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("bookedBy")
      .populate("bookedTo");

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

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getByStaffId(req, res) {
  try {
    const bookings = await bookingModel
      .find({bookedTo: req.params.id})
      .populate("bookedBy")
      .populate("bookedTo")

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getBySuperiorId(req, res) {
  try {
    const bookings = await bookingModel
      .find({bookedBy: req.params.id})
      .populate("bookedBy")
      .populate("bookedTo")

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export { createBooking, getCurrUsrBookingByStaffId, getById, updateById, getByStaffId, getBySuperiorId };
