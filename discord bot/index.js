const discord = require('discord.js');
const WebSocketServer = require("ws").Server;
require('dotenv').config({
	path: __dirname + '/.env'
});

const port = 3005;
const client = new discord.Client();
const wss = new WebSocketServer({port})

wss.on('connection', (ws) => {
	console.log('User connected')
})

client.on('ready', () => {
	console.log('Bot started')
})
const userId = process.env.USERID

client.on('voiceStateUpdate', (oldState, newState) => {
	const oldVoice = oldState.selfMute;
	const newVoice = newState.selfMute;
	const id = userId;
	if (oldVoice !== newVoice && id == newState.id) {
		console.log(newVoice)
		wss.broadcast(JSON.stringify({muted: newVoice}))
	}
})

wss.broadcast = function(data) {
	wss.clients.forEach(client => client.send(data));
};

client.login(process.env.BOT_TOKEN)
