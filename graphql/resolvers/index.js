const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const { dateToString } = require("../../helpers/date");

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

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
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
    return transformBooking(result);
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
