import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainPage from "./mainPage.tsx";
import PassengerPage from "./passengerPage.tsx";
import WorkerRegPage from "./workerRegPage.tsx";
import Page404 from "./page404.tsx";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/passenger/:id" element={<PassengerPage />} />
      <Route path="/worker/registration" element={<WorkerRegPage />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
