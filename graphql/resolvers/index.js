const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

// to reduce redundancy we create the transformEvent function to work with all the fields needed
const transformEvent = (eventToTransform) => {
  return {
    ...eventToTransform._doc,
    _id: eventToTransform.id,
    date: new Date(eventToTransform._doc.date).toISOString(),
    creator: user.bind(this, eventToTransform.creator),
  };
};

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

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        // return {
        //   ...event._doc,
        //   _id: event.id, // <--- <<<_id: EVENT.ID>>> is a shortcut provided by Mongoose to read the id. But result._doc._id.toString() is also effective.
        //   date: new Date(event._doc.date).toISOString(),
        //   creator: user.bind(this, event._doc.creator),
        // };
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args) => {
    // const event = {
    //   _id: Math.random().toString(),
    //   title: args.eventInput.title,
    //   description: args.eventInput.description,
    //   price: +args.eventInput.price,
    //   date: args.eventInput.date,
    // };

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5ef804f31f89223a56e43688",
    });

    let createdEvent;

    try {
      // events.push(event); <--- before constructor
      const result = await event.save(); // <--- with constructor
      //   createdEvent = {
      //     ...result._doc,
      //     _id: result._doc._id.toString(), // <--- OR _id: event.id
      //     date: new Date(event._doc.date).toISOString(),
      //     creator: user.bind(this, result._doc.creator),
      //   };
      createdEvent = transformEvent(result);
      const creator = await User.findById("5ef804f31f89223a56e43688");

      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
    // return event; // <--- before constructor
  },

  createUser: async (args) => {
    try {
      // to eliminate all non-unique users
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exists.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args) => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: "5ef804f31f89223a56e43688",
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result.doc,
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
