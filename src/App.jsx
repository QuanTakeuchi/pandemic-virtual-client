import { useState, useEffect } from 'react'
import './App.css'
import { socket } from './socket'
import Map from './components/Map/Map'
import PlayerHand from './components/PlayerHand/PlayerHand'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameState, setGameState] = useState(null);
  const [selectedAction, setSelectedAction] = useState('drive');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastAction, setLastAction] = useState(null);

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
    
    function onError(msg) {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 3000);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('initial_state', onStateUpdate);
    socket.on('game_state_update', onStateUpdate);
    socket.on('error_message', onError);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('initial_state', onStateUpdate);
      socket.off('game_state_update', onStateUpdate);
      socket.off('error_message', onError);
    };
  }, []);

  const handleCityClick = (cityName) => {
      if (!gameState) return;
      // Optimistic or just logging
      const action = { type: selectedAction, target: cityName };
      console.log(`Action: ${selectedAction} -> ${cityName}`);
      setLastAction(action);
      
      socket.emit('player_move', action);
  };

  const handleEndTurn = () => {
    socket.emit('end_turn');
  };

  const handleCardClick = (card) => {
    if (myPlayer?.mustDiscard) {
      if (confirm(`Discard ${card.name}?`)) {
        socket.emit('discard_card', card.name);
      }
    } else {
      console.log('Card clicked:', card);
    }
  };

  const myPlayer = gameState?.players?.[socket.id];

  return (
    <div className="app">
      <header className="status-bar">
        <h1>Pandemic Virtual</h1>
        <div className="status-group">
            <span className="status-item">Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</span>
            {errorMessage && <span className="error-message">⚠️ {errorMessage}</span>}
        </div>
      </header>

      <div className="game-layout">
        <main className="game-board">
            {gameState ? (
                <>
                    <Map gameState={gameState} onCityClick={handleCityClick} />
                    {myPlayer && (
                        <PlayerHand 
                            hand={myPlayer.hand} 
                            onCardClick={handleCardClick}
                            mustDiscard={myPlayer.mustDiscard}
                        />
                    )}
                </>
            ) : (
                <div className="loading">Loading Game State...</div>
            )}
        </main>

        <aside className="controls-panel">
            {myPlayer ? (
                <div className="player-info">
                    <h2>My Player</h2>
                    <p><strong>Role:</strong> {myPlayer.role || 'Unassigned'}</p>
                    <p><strong>Location:</strong> {myPlayer.location}</p>
                    {/* Hand removed from here, moved to PlayerHand component */}
                </div>
            ) : (
                <p>Waiting for player data...</p>
            )}

            <div className="actions">
                <h3>Movement Actions</h3>
                <div className="action-buttons">
                    <button 
                        className={selectedAction === 'drive' ? 'active' : ''} 
                        onClick={() => setSelectedAction('drive')}
                    >
                        Drive / Ferry
                    </button>
                    <button 
                        className={selectedAction === 'shuttle' ? 'active' : ''} 
                        onClick={() => setSelectedAction('shuttle')}
                    >
                        Shuttle Flight
                    </button>
                    <button 
                        className={selectedAction === 'direct' ? 'active' : ''} 
                        onClick={() => setSelectedAction('direct')}
                    >
                        Direct Flight
                    </button>
                    <button 
                        className={selectedAction === 'charter' ? 'active' : ''} 
                        onClick={() => setSelectedAction('charter')}
                    >
                        Charter Flight
                    </button>
                </div>
                
                <div className="turn-controls">
                    <button 
                        className="end-turn-btn"
                        onClick={handleEndTurn}
                        disabled={myPlayer?.mustDiscard} 
                    >
                        {myPlayer?.mustDiscard ? 'Must Discard Cards' : 'End Turn'}
                    </button>
                </div>

                <div className="action-help">
                    <p>
                    {selectedAction === 'drive' && "Click an adjacent city (connected by a line)."}
                    {selectedAction === 'shuttle' && "Click another research station to move there."}
                    {selectedAction === 'direct' && "Click a city matching a card in your hand (discards that card)."}
                    {selectedAction === 'charter' && "Click ANY city if you discard the card matching your current location."}
                    </p>
                </div>
            </div>
        </aside>
      </div>
    </div>
  )
}

export default App
