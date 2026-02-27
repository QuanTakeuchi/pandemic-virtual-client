import React from 'react';
import './PlayerHand.css';

const PlayerHand = ({ hand, onCardClick, mustDiscard }) => {
    return (
        <div className={`player-hand ${mustDiscard ? 'must-discard' : ''}`}>
            {mustDiscard && <div className="discard-message">Hand Limit Reached! Discard {hand.length - 7} card(s).</div>}
            <div className="cards-container">
                {hand.map((card, i) => (
                    <div 
                        key={i} 
                        className={`hand-card ${card.color || 'event'} ${card.type}`}
                        onClick={() => onCardClick(card)}
                    >
                        <div className="card-top">{card.name}</div>
                        {card.description && <div className="card-desc">{card.description}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerHand;
