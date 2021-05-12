import React from "react";
import Routes from "./routes";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import store from './redux/store';
import {ApolloProvider} from "@apollo/client";
import client from './shared/api';

function App() {

  return (<Provider store={store}>
          <CssBaseline />
          <ApolloProvider client={client}>
              <Routes/>
          </ApolloProvider>
    </Provider>
  );
}

export default App;
