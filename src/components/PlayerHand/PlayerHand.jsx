import React from 'react';
import './PlayerHand.css';

const PlayerHand = ({ hand, onCardClick, mustDiscard }) => {
    return (
        <div className={`player-hand-container ${mustDiscard ? 'discard-mode' : ''}`}>
            {mustDiscard && (
                <div className="discard-overlay">
                    ⚠️ Hand Limit Reached! Click a card to discard.
                </div>
            )}
            <div className="hand-cards">
                {hand.map((card, index) => (
                    <div 
                        key={`${card.name}-${index}`} 
                        className={`hand-card ${card.color || 'event'} ${card.type}`}
                        onClick={() => onCardClick(card)}
                        title={card.description || card.name}
                    >
                        <div className="card-header">{card.name}</div>
                        {card.type === 'event' && <div className="card-desc">{card.description}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerHand;
