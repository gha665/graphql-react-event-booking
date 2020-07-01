const Event = require("../../models/event");

const { transformEvent } = require("./merge");

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
      creator: "5c0fbd06c816781c518e4f3e",
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
      const creator = await User.findById("5c0fbd06c816781c518e4f3e");

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
};
