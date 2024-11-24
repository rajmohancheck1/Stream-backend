const Event = require('../models/Event');

// Create an event
//http://localhost:5000/api/events
const newEvent = async (req, res) => {
  try {
    const { eventName, startDate, startTime, endDate, endTime, location, description, eventType, ticketsRequired, maxCapacity } = req.body;

    // Ensure required fields are present
    if (!eventName || !startDate || !startTime || !endDate || !endTime) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Create the event and save it to the database
    const event = await Event.create({
      creator: req.user.id,
      eventName,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      description,
      eventType,
      ticketsRequired,
      maxCapacity,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error while creating event.' });
  }
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

// http://localhost:5000/api/events/id
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
//
// http://localhost:5000/api/events/id
const deleteEvent = async (req, res) => {
  const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the current user is the creator of the event
        if (event.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await Event.findByIdAndDelete(id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
