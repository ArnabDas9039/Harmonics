import React from "react";
import "../styles/SeekBar.css";

// const SeekBar = ({ min, max, step, value, onChange, buffered, played }) => {
const SeekBar = ({ min, max, step, value, onChange, played }) => {
  return (
    <div className="custom-range-input">
      <div className="seekbar-wrapper">
        {/* <div
          className="seekbar-buffered"
          style={{ width: `${buffered}%` }}
        ></div> */}
        <div className="seekbar"></div>
        <div className="seekbar-played" style={{ width: `${played}%` }}></div>
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
    </div>
  );
};

export default SeekBar;
