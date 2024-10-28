import React, { useState } from "react";
import './OvalArenaMap.css';

const sectors = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Сектор ${i + 1}`,
  color: `hsl(${(i * 15)}, 70%, 50%)`, // разные цвета для каждого сектора
}));

const OvalArenaMap = () => {
  const [selectedSector, setSelectedSector] = useState(null);

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
  };

  return (
    <div className="oval-arena-container">
      {!selectedSector ? (
        <div className="oval-arena">
          <svg viewBox="0 0 100 100" className="oval-map">
            {sectors.map((sector, index) => {
              const angle = (360 / sectors.length) * index; // угол для каждого сектора
              const x = 50 + 35 * Math.cos((angle * Math.PI) / 180); // координаты для овала
              const y = 50 + 20 * Math.sin((angle * Math.PI) / 180);

              return (
                <g
                  key={sector.id}
                  className="sector"
                  onClick={() => handleSectorClick(sector)}
                  transform={`translate(${x}, ${y})`}
                >
                  <circle r="8" fill={sector.color} />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="white"
                    fontSize="2"
                  >
                    {sector.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="sector-details">
          <button onClick={() => setSelectedSector(null)}>Вернуться</button>
          <h2>{selectedSector.name}</h2>
          <p>Цвет сектора: {selectedSector.color}</p>
          <div className="seats">
            {[...Array(50)].map((_, i) => (
              <button key={i} className="seat">Место {i + 1}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OvalArenaMap;
