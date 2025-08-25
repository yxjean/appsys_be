import eventModel from "../models/eventModel.js";

async function createEvent(req, res) {
  try {

    const event = new eventModel(req.body)
    await event.save()

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

async function getEventsByUserId(req, res) {
  try {
    const events = await eventModel
      .find({  user: req.user.id.toString() })
      .populate("user")

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

export { createEvent, getEventsByUserId };
