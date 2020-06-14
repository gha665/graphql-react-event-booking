const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]! 
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),

    // resolver
    rootValue: {
      events: () => {
        return ["Romantic Cooking", "Sailing", "All-Night Coding"];
      },

      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },

    // debugging development tool that apperas in browser, where we can play around and test the app
    // "in-browser tool for writing, validating, and testing GraphQL queries"
    graphiql: true,
  })
);

app.listen(3000);
