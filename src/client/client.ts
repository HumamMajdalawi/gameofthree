require('dotenv').config();
import { io } from 'socket.io-client';
import * as readline from 'readline';
import { Players } from '../types';

const port = process.env.APP_PORT || 3000;
const socket = io(`http://localhost:${port}`);
let currentPlayer: Number;
const divisionFactor = 3;
const choices = [-1, 0, 1];

socket.on('connect', () => {
  console.log(`⚡️ player connected to server`);
  socket.emit(`whichPlayer-${socket.id}`);

  socket.on(`whichPlayerAnswer-${socket.id}`, (players: Players) => {
    //Getting first client turn choice
    if (Object.keys(players).length === 0) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question('You want to be player 1 or 2? [1/2] ', (answer) => {
        if (answer === '1' || answer === '2') {
          currentPlayer = parseInt(answer);
          // Register player turn
          sendAnswer(parseInt(answer));
        } else {
          console.log('Invalid input');
        }
        rl.close();
      });
    } else {
      // If first player choose 1 then you are 2 or vice versa
      const existingPlayer = players[Object.keys(players)[0]].name;
      console.log(`Player ${existingPlayer} is already connected`);
      currentPlayer = existingPlayer === 1 ? 2 : 1;
      console.log(`You are player ${currentPlayer}`);
      // Register player turn
      sendAnswer(currentPlayer);
    }
  });

  socket.on(`playerTurn-${socket.id}`, (turn: number) => {
    console.log(`other\'s player turn is [${turn}]`);
    // use {-1, 0, 1} to make sure the turn is divisable by 3 and then send the remainder
    const correctChoice = choices.find((item) => {
      return (Number(turn) + item) % divisionFactor === 0;
    });
    const remainder = (turn + correctChoice) / divisionFactor;
    console.log(`====> your turn is [${remainder}]`);
    socket.emit(`playerTurn-${socket.id}`, remainder);
  });
});

socket.on('disconnect', () => {
  console.log(`player disconnected from server`);
});

socket.on('gameEnded', (winner: Number) => {
  console.log('==========================================');
  console.log(`GAME ENDED - player ${winner} won!`);
  console.log('==========================================');
});

const sendAnswer = (player: Number) => {
  socket.emit(`playerChoice-${socket.id}`, player);
};

const generateRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

socket.on('ready', () => {
  console.log('==========================================');
  console.log('GAME STARTED');
  console.log('==========================================');

  // Let first player start the Game
  if (currentPlayer != 2) {
    console.log('you play first');
    const startingNumber = generateRandomInteger(3, 1000);
    socket.emit(`playerTurn-${socket.id}`, startingNumber);
  }
});
