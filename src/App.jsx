import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";

import { ModalProvider } from "./utils/modalContext"
import Modal from "./components/modal/Modal";

import Home from "./home/Home";

function App() {
  return (
    <ModalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Modal />
    </ModalProvider>
  );
}

export default App;
