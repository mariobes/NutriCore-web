import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Guards } from "./guards";
import AuthPage from "@/pages/AuthPage/AuthPage";
import UserPrivatePage from "@/pages/UserPrivatePage/UserPrivatePage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/userPrivate/:id" element={<Guards><UserPrivatePage /></Guards>} />
      </Routes>
    </BrowserRouter>
  );
}