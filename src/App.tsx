import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PaginationPage from "./pages/PaginationPage";
import HomePage from "./pages/HomePage";
import DebounceSearch from "./pages/DebounceSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pagination" element={<PaginationPage />} />
        <Route path="/debounce-search" element={<DebounceSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
