import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import MainNav from "./shared-components/MainNav";
import Footer from "./shared-components/Footer";
import Landing from "./shared-components/Landing";

import Home from "./cricket-components/Home";
import FantasySport from "./cricket-components/FantasySport";
import PageNotFound from "./shared-components/404.js";

import NrlHome from "./nrl-components/Home";
import NrlSportsBetting from "./nrl-components/SportsBetting";
import NrlFantasySport from "./nrl-components/FantasySport";

import "./app.css";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Container fluid style={{ height: "100vh" }}>
      <BrowserRouter>
        <MainNav />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/cricket" component={Home} />
          <Route exact path="/cricket/fantasysport" component={FantasySport} />
          <Route exact path="/nrl" component={NrlSportsBetting} />
          <Route exact path="/nrl/fantasysport" component={NrlFantasySport} />
          <Route component={PageNotFound} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </Container>
  );
}

export default App;
