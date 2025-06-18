import "./App.css";
import { Routes, Route } from "react-router";
import Header from "./components/Header/Header.tsx";
import GeneratePage from "./pages/GeneratePage/GeneratePage.tsx";
import HistoryPage from "./pages/HistoryPage/HistoryPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/generate" element={<GeneratePage />} />
      </Routes>
    </>
  );
}

export default App;
