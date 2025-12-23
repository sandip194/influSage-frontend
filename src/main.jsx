import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './app/Store.js';
import AppWrapper from './AppWrapper.jsx';
import GlobalSecurityBlocker from './GlobalSecurityBlocker.jsx';
import GlobalLoader from "./GlobalLoader";



createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <AppWrapper>
        <GlobalLoader /> 
        <GlobalSecurityBlocker />
        <App />
      </AppWrapper>
    </Provider>
  // </StrictMode>,
)
