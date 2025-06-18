import { Routes, Route } from "react-router";
import { GeneratePage } from "./pages/GeneratePage/GeneratePage.tsx";
import { HistoryPage } from "./pages/HistoryPage/HistoryPage.tsx";
import { UploadPage } from "./pages/UploadPage/UploadPage.tsx";
import { Layout } from "./components/Layout/Layout.tsx";

export const App = () => (
  <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<UploadPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/generate" element={<GeneratePage />} />
      </Route>
    </Routes>
  </>
);
