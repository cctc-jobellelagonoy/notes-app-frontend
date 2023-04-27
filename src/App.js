import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NoteList from "./components/NoteList";

function App() {
  return (
    <Router>
      <div className="App">
        <NoteList/>
      </div>
    </Router>
  );
}

export default App;
