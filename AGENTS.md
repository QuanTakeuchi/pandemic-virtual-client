# Pandemic Virtual Client - LLM Context

## Overview
This is the frontend for the Pandemic Virtual board game implementation.

## Tech Stack
- **Framework**: React 19, Vite
- **Networking**: `socket.io-client` for real-time communication with the backend.
- **Styling/Rendering**: Standard CSS and SVG for the interactive game map.

## Key Directories & Files
- `src/components/Map`: Contains logic for rendering the SVG world map, cities, connections, and player tokens.
- `src/components/PlayerHand`: UI for displaying the current player's hand of cards.
- `src/App.jsx`: Main application logic and socket event listeners.
- `src/socket.js`: Socket.io connection initialization.

## State Management
State is strictly authoritative from the server. The client receives state updates via websockets (`gameState` events) and re-renders the UI accordingly.

## Current Tasks
Working on Day 8 tasks: Adding game indicators (Infection Rate, Outbreaks, Research Stations, Cures) and overall UI polish.

## Important LLM Instruction
Whenever an LLM loads this file into context and makes changes to the package, it must update this AGENTS.md file along with the changes to keep the context accurate and up-to-date.
