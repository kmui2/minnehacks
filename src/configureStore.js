import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { history } from './history';
import createRootReducer from './reducers';
import rootSaga from './sagas';

const DEV = process.env.NODE_ENV !== 'production';

const sagaMiddleware = createSagaMiddleware({});

const middleware = [sagaMiddleware, routerMiddleware(history)];

if (!DEV) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
  }
} else {
  middleware.push(createLogger({
    predicate: (action: any) => !/^@@/.test(action.type),
    collapsed: true,
  }));
}

const composeEnhancers =
  DEV &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose;

const store = createStore(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(...middleware)),
);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);
export default () => {
  return { store, persistor };
};
