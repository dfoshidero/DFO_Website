import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";

import { ContentProvider, useUiText } from "./utils/contentContext"
import { ModalProvider } from "./utils/modalContext"
import { RecommendationsProvider } from "./utils/recommendationsContext"
import Modal from "./components/modal/Modal";

import Home from "./home/Home";

/**
 * Keeps the tab title and meta description in step with the Studio.
 *
 * index.html ships static copies of both, so crawlers and link previews that do
 * not run JavaScript still get sensible values. This updates them once the live
 * content arrives, which means editing them needs no deploy.
 */
function DocumentMeta() {
  const ui = useUiText();
  const pageTitle = ui?.meta?.pageTitle;
  const metaDescription = ui?.meta?.metaDescription;

  useEffect(() => {
    if (pageTitle) document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    if (!metaDescription) return;
    let tag = document.head.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", metaDescription);
  }, [metaDescription]);

  return null;
}

function App() {
  return (
    <ContentProvider>
      <DocumentMeta />
      <ModalProvider>
        <RecommendationsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Modal />
        </RecommendationsProvider>
      </ModalProvider>
    </ContentProvider>
  );
}

export default App;
