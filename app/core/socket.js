
/**
 * Simple Socket Manager
 * Author :: Stephen Braitsch
 */

var io, appName, clients = {};

module.exports = function(sio, an) {
	
	io = sio; appName = an;
	io.on('connection', registerSocket);
	return this;
}

module.exports.onConnect = function(){}

function registerSocket(socket)
{
// listen for connections events //
	onSocketConnect(socket);
	socket.on('disconnect', function() { onSocketDisconnect(socket); });
}

function onSocketConnect(socket)
{
	if (socket.handshake.headers.host.indexOf(appName) != -1){
		console.log('connecting ---', socket.handshake.headers.host);
		module.exports.onConnect(socket);
		// dispatch to clients //		
		clients[socket.id] = {};
		io.sockets.emit(appName + '-status', { connections:clients });
	}
}

function onSocketDisconnect(socket)
{	
	if (socket.handshake.headers.host.indexOf(appName) != -1){
		console.log('disconnecting --- ', socket.handshake.headers.host, socket.id)
		// dispatch to clients //
		delete clients[socket.id];
		io.sockets.emit(appName + '-status', { connections:clients });
	}
}
