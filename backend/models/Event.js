const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, enum: ['Physical', 'Virtual'], required: true },
    virtualLink: { type: String }, // Optional for virtual events
    description: { type: String, required: true },
    eventType: { type: String, enum: ['Public', 'Private'], required: true },
    ticketsRequired: { type: Boolean, default: false },
    maxCapacity: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
