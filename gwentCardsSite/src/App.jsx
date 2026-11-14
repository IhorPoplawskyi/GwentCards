import React, { useState } from "react";
import "./App.css";
import { factions } from "./data/factionts";
import { red } from "./data/cards/red";
import { green } from "./data/cards/green";
import { neutral } from "./data/cards/neutral";

const getCardWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return "КАРТА";
  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 12 || count % 100 > 14)
  )
    return "КАРТЫ";

  return "КАРТ";
};

const cards = {
  red: red,
  green: green,
  blue: [[], [], []],
  neutral: neutral,
};

function Card({ card, color, onClick }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - y) * 10,
      y: (x - 0.5) * 10,
    });
  }

  return (
    <div
      className="card-wrapper"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={() => onClick(card)}
      style={{
        "--faction": color,
        "--rotate-x": `${tilt.x}deg`,
        "--rotate-y": `${tilt.y}deg`,
      }}
    >
      <div className="card">
        <img src={card.image} alt={card.name} />
        <div className="card-glare" />
      </div>
    </div>
  );
}

function Faction({ faction, onCardClick }) {
  const factionCards = cards[faction.id];

  const total = factionCards.reduce((sum, row) => sum + row.length, 0);

  return (
    <section
      id={faction.id}
      className={`faction faction-${faction.id}`}
      style={{ "--faction": faction.color }}
    >
      <div className="faction-heading">
        <div className="faction-symbol">{faction.symbol}</div>

        <div className="faction-title">
          <span>FACTION COLLECTION</span>
          <h2>{faction.name}</h2>
          <p>{faction.subtitle}</p>
        </div>

        <div className="faction-total">
          <strong>{total}</strong>
          <span>
            {getCardWord(total)}
          </span>
        </div>
      </div>

      {faction.rows.map((row, index) => (
        <div className="unit-row" key={row}>
          <div className="row-title">
            <span className="row-index">0{index + 1}</span>
            <h3>{row}</h3>
            <div className="row-divider" />
            <span className="row-total">
              {factionCards[index].length}{" "}
              {getCardWord(factionCards[index].length)}
            </span>
          </div>

          <div className="cards-container">
            {factionCards[index].length ? (
              factionCards[index].map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  color={faction.color}
                  onClick={onCardClick}
                />
              ))
            ) : (
              <div className="empty-row">
                <span>✧</span>
                <span>Картки цього ряду</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="app">
      <div className="background-texture" />
      <div className="ambient-light" />

      <header className="topbar">
        <a className="logo" href="#">
          <span>✦</span> MYGWENT
        </a>
        <div className="topbar-right">
          CARD COLLECTION <span>◆</span> 2026
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-kicker">
            <span /> THE WORLD OF GWENT <span />
          </div>

          <h1>
            HWM <em>GWENT</em>
          </h1>

          <p></p>

          <div className="hero-decoration">
            <span />
            ✦
            <span />
          </div>

          <div className="hero-count">
            <span>THREE FACTIONS</span>
            <span>·</span>
            <span>THREE BATTLE ROWS</span>
          </div>
        </section>

        <nav className="faction-nav">
          {factions.map((f) => (
            <a key={f.id} href={`#${f.id}`} style={{ "--faction": f.color }}>
              <span>{f.symbol}</span>
              {f.name}
            </a>
          ))}
        </nav>

        <div className="collection">
          {factions.map((faction, index) => (
            <React.Fragment key={faction.id}>
              <Faction faction={faction} onCardClick={setSelected} />
              {index !== factions.length - 1 && (
                <div className="section-divider">
                  <span />
                  ✦
                  <span />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </main>

      <footer>
        <span>✦</span> MYGWENT <span>✦</span>
        <p>THE ART OF WAR NEVER ENDS</p>
      </footer>

      {selected && (
        <div className="card-modal" onClick={() => setSelected(null)}>
          <button className="modal-close" onClick={() => setSelected(null)}>
            ×
          </button>

          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} />
          </div>
        </div>
      )}
    </div>
  );
}
