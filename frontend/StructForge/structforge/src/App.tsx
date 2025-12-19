import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import { Header } from "@/components/ui/header";
import TextToDirectoryPage from "@/pages/TextToDirectoryPage";
import ZipToDirectoryPage from "./pages/ZipToDirectoryPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/actions/text-to-dir" element={<TextToDirectoryPage />} />
        <Route path="/actions/zip-to-dir" element={<ZipToDirectoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;