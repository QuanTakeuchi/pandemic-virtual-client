import React, { useMemo } from 'react';
import citiesData from '../../../../shared/cities.json';
import './Map.css';

const Map = ({ gameState }) => {
    // Process cities data to prepare for rendering
    const { cities, connections } = useMemo(() => {
        const cityList = Object.entries(citiesData).map(([name, data]) => ({
            name,
            ...data
        }));

        const connectionList = [];
        const processedConnections = new Set();

        cityList.forEach(city => {
            city.neighbors.forEach(neighborName => {
                const neighbor = citiesData[neighborName];
                // Create a unique key for the connection (alphabetically sorted)
                const connectionKey = [city.name, neighborName].sort().join('-');
                
                if (!processedConnections.has(connectionKey)) {
                    connectionList.push({
                        id: connectionKey,
                        start: { x: city.x, y: city.y },
                        end: { x: neighbor.x, y: neighbor.y }
                    });
                    processedConnections.add(connectionKey);
                }
            });
        });

        return { cities: cityList, connections: connectionList };
    }, []);

    // Helper to render cubes
    const renderCubes = (cityName) => {
        if (!gameState || !gameState.cities || !gameState.cities[cityName]) return null;
        const cubes = gameState.cities[cityName].cubes;
        const cubeSize = 8;
        const cubeElements = [];
        let index = 0;

        // Colors mapping to hex if needed, or rely on CSS classes/standard names
        const colorMap = {
            blue: '#007bff',
            yellow: '#ffc107',
            black: '#343a40',
            red: '#dc3545'
        };

        Object.entries(cubes).forEach(([color, count]) => {
            for (let i = 0; i < count; i++) {
                // Determine offset based on index (stacking or grid)
                // Grid of 2x2 centered roughly
                const offsetX = (index % 2) * (cubeSize + 1) - cubeSize; 
                const offsetY = Math.floor(index / 2) * (cubeSize + 1) - cubeSize - 12; // Above the city
                
                cubeElements.push(
                    <rect
                        key={`${cityName}-${color}-${i}`}
                        x={citiesData[cityName].x + offsetX}
                        y={citiesData[cityName].y + offsetY}
                        width={cubeSize}
                        height={cubeSize}
                        fill={colorMap[color] || color}
                        stroke="white"
                        strokeWidth="1"
                        className="disease-cube"
                    />
                );
                index++;
            }
        });
        return cubeElements;
    };

    // Helper to render research station
    const renderStation = (cityName) => {
        if (!gameState || !gameState.researchStations || !gameState.researchStations.includes(cityName)) return null;
        const { x, y } = citiesData[cityName];
        // Draw a simple house shape (pentagon)
        return (
            <path
                d={`M${x},${y+8} L${x+6},${y+14} L${x+6},${y+20} L${x-6},${y+20} L${x-6},${y+14} Z`}
                fill="white"
                stroke="black"
                strokeWidth="1"
                className="research-station"
            />
        );
    };

    // Helper to render players
    const renderPlayers = (cityName) => {
        if (!gameState || !gameState.players) return null;
        const playersHere = Object.values(gameState.players).filter(p => p.location === cityName);
        
        return playersHere.map((player, idx) => {
            const { x, y } = citiesData[cityName];
            // Stack players horizontally
            const offset = (idx * 10) - ((playersHere.length - 1) * 5); 
            
            // Random color generator based on ID if role color not available
            const playerColor = player.role === 'Medic' ? '#fd7e14' : 
                                player.role === 'Researcher' ? '#6f42c1' :
                                `hsl(${parseInt(player.id.slice(-3), 16) % 360}, 70%, 50%)`;

            return (
                <g key={player.id} transform={`translate(${x + offset}, ${y - 15})`}>
                    <circle
                        r="5"
                        fill={playerColor}
                        stroke="white"
                        strokeWidth="2"
                        className="player-pawn"
                    />
                    {/* Tiny simplified pawn shape could go here instead of circle */}
                </g>
            );
        });
    };

    return (
        <div className="map-container">
            <svg viewBox="0 0 1000 500" className="world-map">
                {/* Connections Layer */}
                <g className="connections">
                    {connections.map(conn => (
                        <line
                            key={conn.id}
                            x1={conn.start.x}
                            y1={conn.start.y}
                            x2={conn.end.x}
                            y2={conn.end.y}
                            className="connection-line"
                        />
                    ))}
                </g>

                {/* Cities Layer */}
                <g className="cities">
                    {cities.map(city => (
                        <g key={city.name} className={`city-group ${city.color}`}>
                            <circle
                                cx={city.x}
                                cy={city.y}
                                r="6"
                                className="city-circle"
                            />
                            <text
                                x={city.x}
                                y={city.y + 15} // Below the city
                                textAnchor="middle"
                                className="city-label"
                            >
                                {city.name}
                            </text>

                            {/* Game Objects */}
                            {renderStation(city.name)}
                            {renderCubes(city.name)}
                            {renderPlayers(city.name)}
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default Map;
