require('dotenv').config();
import socketIO from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { Players } from 'src/types';

const port = process.env.APP_PORT || 3000;
const players: Players = {};

const app = express();
const httpServer = createServer(app);

const io = new socketIO.Server(httpServer);

io.on('connection', (socket: socketIO.Socket) => {
  console.log('a user connected : ' + socket.id);

  socket.on('disconnect', function () {
    console.log('socket disconnected : ' + socket.id);
  });

  socket.on(`playerChoice-${socket.id}`, (choice: Number) => {
    players[socket.id] = {
      id: socket.id,
      choice: choice,
    };
    console.log(players);
    // count the connected users
    if (io.engine.clientsCount === 2) {
      io.emit('ready');
    }
  });

  socket.on(`whichPlayer-${socket.id}`, () => {
    io.emit(`whichPlayerAnswer-${socket.id}`, players);
  });

  socket.on(`playerTurn-${socket.id}`, (turn: Number) => {
    if (Number(turn) === 1) {
      console.log('==========================================');
      console.log(`GAME ENDED - player ${players[socket.id].choice} won!`);
      console.log('==========================================');

      io.emit('gameEnded', players[socket.id].choice);
      return;
    }

    console.log(`====> player ${players[socket.id].choice} turn was [${turn}]`);
    const otherPlayerSocketId = Object.keys(players).filter(
      (player) => player !== socket.id,
    )[0];

    io.emit(`playerTurn-${otherPlayerSocketId}`, turn);
  });
});

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
