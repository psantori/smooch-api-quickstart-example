////////////// Easy way
var dotenv = require('dotenv');
dotenv.config();
dotenv.load();
var slack_oauth = require('./slackoauth')

var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN;
console.log(bot_token)
//console.log(slack_oauth.app)
var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  //rtm.sendMessage("Hello!", 'C3U3BMP1V');
});

rtm.start();

// Initialize using verification token from environment variables
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;

const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
const port = process.env.PORT || 3000;

// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event)=> {
  const attachments = event && event.attachments || [];
  console.log(event);
  for (attachment of attachments){
    if(attachment.pretext == 'hey'){
      rtm.sendMessage(`<#${event.channel}>`, 'C3U3BMP1V');
    }
  }
  //rtm.sendMessage("Hello!", 'C3U3BMP1V');
  //console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  //console.log(event);
});

// Start a basic HTTP server
// slackEvents.start(port).then(() => {
//   console.log(`server listening on port ${port}`);
// });

/////// Express wey

const http = require('http');

// Initialize using verification token from environment variables
//const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
//const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);

// Initialize an Express application
const express = require('express');
const bodyParser = require('body-parser');
//const app = express();

// You must use a body parser for JSON before mounting the adapter
slack_oauth.app.use(bodyParser.json());

// Mount the event handler on a route
// NOTE: you must mount to a path that matches the Request URL that was configured earlier
slack_oauth.app.use('/event', slackEvents.expressMiddleware());


// Start the express application
// http.createServer(slack_oauth.app).listen(process.env.PORT, () => {
//   console.log(`server listening on port ${port}`);
// });

// // Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
// slackEvents.on('message', (event)=> {
//   console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
// });
