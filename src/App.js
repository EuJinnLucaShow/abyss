import { useState } from "react";

import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BackDrop } from "./components/Tree/Tree.styled";

function App() {
  const [serviceCount, setServiceCount] = useState(0);
  const [view, setView] = useState("list view");

  function transitCount(value) {
    setServiceCount(serviceCount + value);
  }

  const [zoomValue, setZoomValue] = useState(0);

  function transitZoomValue(value) {
    setZoomValue(value);
  }

  function transitView(value) {
    setView(value);
  }

  return (
    <BackDrop id="backdrop">
      <Header
        serviceCount={serviceCount}
        transitZoomValue={transitZoomValue}
        transitView={transitView}
      />
      <Main transitCount={transitCount} zoomValue={zoomValue} view={view} />
    </BackDrop>
  );
}

export default App;
