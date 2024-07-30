import { createContext, useState, useEffect } from "react";
const PlayingContext = createContext();

export const PlayingProvider = ({ children }) => {
  const [playing, setPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);

  useEffect(() => {}, [playing, isPlaying, queue]);

  return (
    <PlayingContext.Provider value={{ playing, setPlaying, isPlaying, setIsPlaying, queue, setQueue }}>
      {children}
    </PlayingContext.Provider>
  );
};

export default PlayingContext;
