import "../styles/Navigation.css";
import { Link, Outlet } from "react-router-dom";

function Navbutton(props) {
  return (
    <div className="nav-button">
      <div className="icon">
        <img
          src={"http://127.0.0.1:8000/api/static/icons/" + props.name + ".svg"}
          className="icon-image"
        />
      </div>
      <div className="icon-label">{props.name}</div>
    </div>
  );
}

function Navigation() {
  return (
    <>
      <div className="navigation destination">
        <Link to="/">
          <div className="nav-button">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="var(--md-sys-color-on-background)"
              >
                <path d="M233.85-193.85h156.92v-238.46h178.46v238.46h156.92v-369.23L480-749.49 233.85-563.25v369.4ZM200-160v-420l280-211.54L760-580v420H535.38v-238.46H424.62V-160H200Zm280-311.74Z" />
              </svg>
            </div>
            <div className="icon-label">Home</div>
          </div>
        </Link>
        <Link to="/explore">
          <div className="nav-button">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="var(--md-sys-color-on-background)"
              >
                <path d="m286.15-286.15 252.31-135.39 135.39-252.31-252.31 135.39-135.39 252.31ZM480-440q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm.13 320q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </div>
            <div className="icon-label">Explore</div>
          </div>
        </Link>
        <Link to="/library">
          <div className="nav-button">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="var(--md-sys-color-on-background)"
              >
                <path d="M487.69-372.31q33.54 0 56.77-23.23 23.23-23.23 23.23-56.77v-229.23h109.23v-61.54h-140v232.31q-9.92-10.77-22.23-16.15-12.31-5.39-27-5.39-33.54 0-56.77 23.23-23.23 23.23-23.23 56.77 0 33.54 23.23 56.77 23.23 23.23 56.77 23.23ZM324.62-280q-27.62 0-46.12-18.5Q260-317 260-344.62v-430.76q0-27.62 18.5-46.12Q297-840 324.62-840h430.76q27.62 0 46.12 18.5Q820-803 820-775.38v430.76q0 27.62-18.5 46.12Q783-280 755.38-280H324.62Zm0-40h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-430.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H324.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v430.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69Zm-120 160q-27.62 0-46.12-18.5Q140-197 140-224.61v-470.77h40v470.77q0 9.23 7.69 16.92 7.69 7.69 16.93 7.69h470.76v40H204.62ZM300-800v480-480Z"/>
              </svg>
            </div>
            <div className="icon-label">Library</div>
          </div>
        </Link>
      </div>
      <Outlet />
    </>
  );
}

export default Navigation;
