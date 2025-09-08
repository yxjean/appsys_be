import eventModel from "../models/eventModel.js";
import moment from 'moment';

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
      .find({  
        user: req.user.id.toString(),
        $or: [
          { deletedAt: { $exists: false } }, // field not present
          { deletedAt: null }                // or explicitly null
        ]
      })
      .populate("user")

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

async function getEventById(req, res) {
  try {
    const event = await eventModel
      .findById(req.params.id)
      .populate("user")

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateEventById(req, res) {
  try {
    const event = await eventModel
      .findOneAndUpdate(
        { _id: req.params.id.toString() },
        { 
          $set: { 
            title: req.body.title,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            updatedAt: moment()
        }},
        { new: true }
      )

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


async function deleteEventById(req, res) {
  try {
    const event = await eventModel
      .findOneAndUpdate(
        { _id: req.params.id.toString() },
        { 
          $set: { 
            updatedAt: moment(),
            deletedAt: moment()
        }},
        { new: true }
      )

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export { createEvent, getEventsByUserId, getEventById, updateEventById, deleteEventById };
