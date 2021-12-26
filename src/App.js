import React, { Component, lazy, Suspense } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from './pages/Home'
const CityList = lazy(() => import('./pages/CityList'));
const Maps = lazy(() => import('./pages/Map'));
const HouseDetaile = lazy(() => import('./pages/HouseDetaile'));
const Login = lazy(() => import('./pages/Login'));
const Registe = lazy(() => import('./pages/Registe'));
const Favorite = lazy(() => import('./pages/Favorite'));
const Renter = lazy(() => import('./pages/Renter'));

export default class App extends Component {
  render() {
    return (
      <Suspense fallback={<div className="router-loading">Loading...</div>}>
        <Router>
          <Routes>
            {/* 路由重定向 */}
            <Route path="/" element={<Navigate to="/home" />}></Route>
            <Route path="/citylist" element={<CityList></CityList>}></Route>
            <Route path="/map" element={<Maps />}></Route>
            <Route path="/home/*" element={<Home />}></Route>
            <Route path="/detaile/:id" element={<HouseDetaile />}></Route>
            <Route path="/registered" element={<Registe />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/favorate" element={<Favorite />}></Route>
            <Route path="/renter/*" element={<Renter />}></Route>
          </Routes>
        </Router >
      </Suspense>
    );
  }
}
