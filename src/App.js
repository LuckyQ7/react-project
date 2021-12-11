import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import CityList from "./pages/CityList";
import Home from "./pages/Home";
import Maps from "./pages/Map";
import Search from "./pages/Search";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          {/* 路由重定向 */}
          <Route path="/" element={<Navigate to="/home" />}></Route>
          <Route path="/citylist" element={<CityList></CityList>}></Route>
          <Route path="/map" element={<Maps />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/home/*" element={<Home />}></Route>
        </Routes>
      </Router>
    );
  }
}
