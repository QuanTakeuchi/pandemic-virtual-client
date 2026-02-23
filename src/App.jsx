import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket'
import Map from './components/Map/Map'

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
    // Also listen for regular updates if the server sends them
    socket.on('update_state', onStateUpdate);

    // If already connected when mounting
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('initial_state', onStateUpdate);
      socket.off('game_state_update', onStateUpdate);
      socket.off('update_state', onStateUpdate);
    };
  }, []);

  return (
    <div className="app">
      <header className="status-bar">
        <h1>Pandemic Virtual</h1>
        <div className="status-item">Status: {isConnected ? 'Connected ✅' : 'Disconnected ❌'}</div>
        {gameState && (
          <>
            <div className="status-item">Outbreaks: {gameState.outbreakCounter}</div>
            <div className="status-item">Infection Rate: {gameState.infectionRateIndex}</div>
          </>
        )}
      </header>

      <main className="game-board">
        <Map gameState={gameState} />
      </main>
    </div>
  )
}

export default App
