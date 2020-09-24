import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./Home";
import MainNav from "./MainNav";
import SportsBetting from "./SportsBetting";
import FantasySport from "./FantasySport";
import PageNotFound from "./404.js";
import Footer from "./Footer";

import "./app.css";

import { Container } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Container fluid style={{ height: "100vh" }}>
      <BrowserRouter>
        <MainNav />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sportsbetting" component={SportsBetting} />
          <Route exact path="/fantasysport" component={FantasySport} />
          <Route component={PageNotFound} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </Container>
  );
}

export default App;
