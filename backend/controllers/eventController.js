const Event = require('../models/Event');

// Create an event
//http://localhost:5000/api/events
const newEvent = async (req, res) => {
    const { eventName, startDate, startTime, endDate, endTime, location, description, eventType, ticketsRequired, maxCapacity } = req.body;
    const event = await Event.create({ creator: req.user.id, eventName, startDate, startTime, endDate, endTime, location, description, eventType, ticketsRequired, maxCapacity });
    res.status(201).json(event);
};

// Get all events
//http://localhost:5000/api/events
const getEvents = async (req, res) => {
  const events = await Event.find({ eventType: 'Public' }).populate('creator', 'name');
  res.json(events);
};

// Get a single event by ID
const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('creator', 'name');

  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// Edit an event (Only creator can edit)
const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event && event.creator.toString() === req.user._id.toString()) {
    event.eventName = req.body.eventName || event.eventName;
    event.startDate = req.body.startDate || event.startDate;
    event.endDate = req.body.endDate || event.endDate;
    event.locationType = req.body.locationType || event.locationType;
    event.location = req.body.location || event.location;
    event.virtualLink = req.body.virtualLink || event.virtualLink;
    event.description = req.body.description || event.description;
    event.tickets = req.body.tickets || event.tickets;
    event.requireApproval = req.body.requireApproval || event.requireApproval;
    event.maxCapacity = req.body.maxCapacity || event.maxCapacity;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(401).json({ message: 'You can only edit your own events' });
  }
};

// Delete an event (Only creator can delete)
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event && event.creator.toString() === req.user._id.toString()) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(401).json({ message: 'You can only delete your own events' });
  }
};

// Attend an event
const attendEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event && event.attendees.length < event.maxCapacity) {
    if (!event.attendees.includes(req.user._id)) {
      event.attendees.push(req.user._id);
      await event.save();
      res.json({ message: 'You have successfully attended the event' });
    } else {
      res.status(400).json({ message: 'You are already attending this event' });
    }
  } else {
    res.status(400).json({ message: 'Event is full or not found' });
  }
};

module.exports = { newEvent, getEvents, getEventById, updateEvent, deleteEvent, attendEvent };
