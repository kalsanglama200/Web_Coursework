import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./router/routes";

function App() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export default App;