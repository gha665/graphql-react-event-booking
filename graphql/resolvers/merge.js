const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

// to reduce redundancy we create the transformEvent function to work with all the fields needed
const transformEvent = (eventToTransform) => {
  return {
    ...eventToTransform._doc,
    _id: eventToTransform.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, eventToTransform.creator),
  };
};

// to reduce redundancy we create the transformBooking function to work with all the fields needed
const transformBooking = (bookingToTransform) => {
  return {
    ...bookingToTransform._doc,
    _id: bookingToTransform.id,
    user: user.bind(this, bookingToTransform._doc.user),
    event: singleEvent.bind(this, bookingToTransform._doc.event),
    createdAt: dateToString(bookingToTransform._doc.createdAt),
    updatedAt: dateToString(bookingToTransform._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
