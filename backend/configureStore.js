import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger'

import rootSaga from './sagas';

import rootReducer from './reducers';
import { navMiddleware } from './navigation';

const sagaMiddleware = createSagaMiddleware({ });

const middleware = [sagaMiddleware, logger, navMiddleware];

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middleware)),
);

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);
export default () => {
  return { store, persistor };
};
