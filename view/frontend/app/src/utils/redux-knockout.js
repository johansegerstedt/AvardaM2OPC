// @flow
import get from 'lodash/get';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import type {Middleware} from 'redux';

type Observable = Function;
type Observables = {[string]: Observable};
type MapToState = string => string;
type Action = {type: string, payload?: any, error?: boolean, meta?: any};
type UpdateAction = {
  type: string,
  payload: {
    keyPath: string,
    value: any,
  },
};

const identity: MapToState = key => key;

export const koInitialState = (
  observables: Observables = {},
  mapObservablesToState: MapToState = identity,
): Object =>
  Object.keys(observables).reduce((state, key) => {
    const observable = observables[key];
    return set(state, mapObservablesToState(key), observable());
  }, {});

export const koSyncMiddleware = (
  observables: Observables = {},
  mapObservablesToState: MapToState = identity,
): Middleware<*, *, *> => store => next => action => {
  const oldState = store.getState();
  next(action);
  Object.keys(observables).forEach(key => {
    const observable = observables[key];
    const keyPath = mapObservablesToState(key);
    const oldValue = get(oldState, keyPath);
    const newValue = get(store.getState(), keyPath);
    if (!isEqual(oldValue, newValue)) {
      observable(get(store.getState(), mapObservablesToState(key)));
    }
  });
};

export const koReducer = (
  map: MapToState = identity,
  actionType: string = 'KO_UPDATE',
) => (state: Object, action: UpdateAction) => {
  if (action.type === actionType) {
    const oldState = {...state};
    const newState = set(
      oldState,
      map(action.payload.keyPath),
      action.payload.value,
    );
    return newState;
  }
  return state;
};

export const createKoAction = (actionType: string = 'KO_UPDATE') => (
  keyPath: string,
  value: any,
): * => ({
  type: actionType,
  payload: {
    keyPath,
    value,
  },
});

export const koEnhancer = ({
  observables = {},
  mapObservablesToState = identity,
  actionCreator = createKoAction(),
}: {
  observables?: Observables,
  mapObservablesToState?: MapToState,
  actionCreator?: (string, any) => Action,
}) => (createStore: Function) => (
  reducer: Function,
  preloadedState?: Object,
  enhancer: Function,
) => {
  const store = createStore(reducer, preloadedState, enhancer);

  Object.keys(observables).forEach(key => {
    const observable = observables[key];
    observable.subscribe(value => {
      store.dispatch(actionCreator(mapObservablesToState(key), value));
    });
  });

  return store;
};

export const koSubscriptions = (
  subscriptions: {
    observable: {subscribe: Function},
    actionCreator(any): Object,
  }[],
) => (createStore: Function) => (
  reducer: Function,
  preloadedState?: Object,
  enhancer: Function,
) => {
  const store = createStore(reducer, preloadedState, enhancer);

  subscriptions.forEach(({observable, actionCreator}) => {
    observable.subscribe(value => {
      store.dispatch(actionCreator(value));
    });
  });

  return store;
};
