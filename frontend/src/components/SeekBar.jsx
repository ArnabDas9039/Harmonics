import React from 'react';
import "../styles/SeekBar.css"

const SeekBar = ({ min, max, step, value, onChange }) => {
  return (
    <div className="custom-range-input">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="range-slider"
      />
    </div>
  );
};

export default SeekBar;
