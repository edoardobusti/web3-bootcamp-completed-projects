import { createRoot } from "react-dom/client";
import { AppProvider } from "./AppContext.jsx";
import backgroundVideo from "./assets/background-tech-video.mp4";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />
    <video
      className="absolute left-0 top-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
    >
      <source src={backgroundVideo} type="video/mp4" />
    </video>
  </AppProvider>,
);
