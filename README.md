# gameofthree

# Requirments

When a player initiates the game, they send a random whole number to their opponent. The receiving player adjusts the number by -1, 0, or 1 to make it divisible by 3. After division, the new number is sent back. The game continues until a player reaches 1.

# Solution

Develop a WebSocket server responsible for handling communication between clients and managing their states. client connect to serve via "connect" channel and server "connection" listener. all other comunction done via custome socket channels.

- whichPlayer : client ask server which player am I, 1 or 2?.
- whichPlayerAnswer: server ask client to choose 1 or 2?
- playerChoice: client inform server about his choice
- ready: server ask client to start the game
- playerTurn: client inform server about his move
- gameEnded: server inform clients game ended

# Diagram

!["Game of three sequance digram showing comuncation between server and client by websocket"](./assets/sequance_digram.png)

# Game Flow

1. The client establishes a connection to the server.
2. The client sends an event "whichPlayer-socketId" to inquire about their designated turn, either 1 or 2.
3. Upon receiving the "whichPlayerAnswer-socketId" event, the server responds by emitting event, allowing the client to select their turn: 1 or 2.
4. The client emits the "playerChoice-socketId" event to notify the server of their choice.
5. The second client (client 2) establishes a connection to the server.
6. Steps (2 - 4) are repeated for the second client, who will receive the remaining choice: 1 or 2.
7. The server emits the "ready" event to both clients, signaling them to commence the game.
8. Client 1 initiates the game by generating a random number between 3 and 1000, then emitting the "playerTurn-socketId" event.
9. The server forwards the "playerTurn-socketId" event to the other client (client 2).
10. Client 2 emits the "playerTurn-socketId" event, including the remaining choice.
11. The game progresses until the remaining reaches 1.
12. The server emits the "gameEnded" event to both clients and records the winner.

# How to run it

- "npm run start:server" Running server to accept clients
- "npm run start:client" Running client
