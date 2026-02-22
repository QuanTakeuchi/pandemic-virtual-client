import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server!');
  socket.emit('get_initial_state');
});

socket.on('initial_state', (gameState) => {
  console.log('Received Game State:');
  console.log('  Cities:', Object.keys(gameState.cities).length);
  console.log('  Outbreak Counter:', gameState.outbreakCounter);
  console.log('  Infection Rate Index:', gameState.infectionRateIndex);
  console.log('  Players:', Object.keys(gameState.players).length);
  
  if (Object.keys(gameState.cities).length === 48 && gameState.outbreakCounter === 0) {
    console.log('SUCCESS: Game State is valid!');
    process.exit(0);
  } else {
    console.error('FAILURE: Game State is invalid!');
    process.exit(1);
  }
});

setTimeout(() => {
  console.error('TIMEOUT: Did not receive state in 5s');
  process.exit(1);
}, 5000);
