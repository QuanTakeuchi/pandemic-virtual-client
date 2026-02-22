import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Connected to server!');
      socket.emit('get_initial_state');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Disconnected from server');
    }

    function onStateUpdate(state) {
      console.log('Received Game State:', state);
      setGameState(state);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('initial_state', onStateUpdate);
    socket.on('game_state_update', onStateUpdate);

    // If already connected when mounting
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('initial_state', onStateUpdate);
      socket.off('game_state_update', onStateUpdate);
    };
  }, []);

  return (
    <div className="app">
      <h1>Pandemic Virtual</h1>
      
      <div className="status-bar">
        Server Status: {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
      </div>

      {gameState ? (
        <div className="game-info">
          <h2>Game State</h2>
          <p>Outbreak Level: {gameState.outbreakCounter}</p>
          <p>Infection Rate Index: {gameState.infectionRateIndex}</p>
          <p>Players Connected: {Object.keys(gameState.players).length}</p>
          <p>Cities: {Object.keys(gameState.cities).length}</p>
          
          <h3>Raw Data (Preview)</h3>
          <pre style={{textAlign: 'left', background: '#333', padding: '10px', borderRadius: '5px', overflow: 'auto', maxHeight: '300px'}}>
            {JSON.stringify(gameState, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading game state...</p>
      )}
    </div>
  )
}

export default App
