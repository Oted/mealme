const Utils = require('./Utils');
const WebSocket = require('ws');

let clients = {};

const Ws = new WebSocket.Server({
  port: 1337
});

/**
 *  When a client connects, open a new socket
 */
Ws.on('connection', (ws) => {
  ws.on('close', () => {
    filterLeft();
  });

  ws.on('message', (message) => {
    const parsed = Utils.parse(message);

    if (typeof parsed === 'string') {
      return console.error(parsed);
    }

    console.log(parsed.type, message);
    switch (parsed.type) {
      case 'connect' :
        return join(Object.assign({}, parsed.user, {notify : false}), ws);
      case 'private-message' :
        return sendMessageTo(parsed.to, parsed);
      case 'notify' :
        return notify(parsed);
      default :
        console.error('no such type ' + parsed.type);
    }
  });

  //send all existing other clients on connect
  //we dont know the name yet so we can not add to clients
  ws.send(
    JSON.stringify({
      type : 'broadcast',
      clients : convertClients()
    })
  );
});

/**
 *  Add client to list
 */
const leave = (user, ws) => {
  clients[user.name] = {
    socket : ws,
    user
  };

  broadcast();
};

const notify = (nObj) => {
  clients[nObj.user.name].user.notify = true;
  clients[nObj.user.name].user.notify_message = nObj.notify_message;

  setTimeout(() => {
    unNotify(nObj)
  },nObj.duration * 1000);

  broadcast();
};

const unNotify = (nObj) => {
  clients[nObj.user.name].user.notify = false;
  clients[nObj.user.name].user.notify_message = null;

  broadcast();
}

/**
 *  Add client to list
 */
const join = (user, ws) => {
  clients[user.name] = {
    socket : ws,
    user
  };

  broadcast();
};

/**
 *  Remove client
 */
const filterLeft = () => {
  Object.keys(clients).forEach((name) => {
    if (clients[name].socket._finalizeCalled) {
      delete clients[name];
    }
  });

  broadcast();
};

/**
 *  Broadcast to everyone
 */
const broadcast = () => {
  const list = Object.keys(clients);

  list.forEach((name) => {
    sendMessageTo(name, {
      type: 'broadcast',
      clients: convertClients()
    });
  });
};

/**
 *  Send message to client
 */
const sendMessageTo = (to, message) => {
  clients[to].socket.send(JSON.stringify(message));
}

const convertClients = () => {
  return Object.keys(clients).map((name) => {
    return clients[name].user;
  });
}
