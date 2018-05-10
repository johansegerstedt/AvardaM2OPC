// @flow
import {applyMiddleware, createStore, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {loadingBarMiddleware} from 'react-redux-loading-bar';
import avardaMiddleware from '$src/avarda/middleware';
import rootSaga from './rootSaga';
import rootReducer from './rootReducer';

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers: Function =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware,
        loadingBarMiddleware({
          promiseTypeSuffixes: ['Request', 'Success', 'Failure'],
        }),
        avardaMiddleware,
      ),
    ),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
