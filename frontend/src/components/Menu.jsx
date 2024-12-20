import { useState, useEffect } from "react";

export const MenuContext = ({ children }) => {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => {
      setClicked(false);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setClicked(true);

        setPoints({
          x: e.pageX,
          y: e.pageY,
        });

        console.log("Right click", e.pageX, e.pageY);
      }}
      style={{ position: "relative" }} // Set a size to see the effect
    >
      {children}
      {clicked && (
        <div>
          <ul
            style={{
              position: "absolute",
              zIndex: "10",
            }}
          >
            <li>Edit</li>
            <li>Delete</li>
            <li>Paste</li>
          </ul>
        </div>
      )}
    </div>
  );
};
