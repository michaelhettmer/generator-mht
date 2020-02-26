import React from 'react';
<% if(redux) { -%>
import { createStore, applyMiddleware, combineReducers, Middleware, Store } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer, Persistor } from 'redux-persist';
import persistStorage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from '@redux-saga/core';
import createRootSaga from 'redux-root-saga';
import { homeReducer, HomeState, initialHomeState } from '~/home';
<% } -%>
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (HelmetProvider as any).canUseDOM = false;
}

export const primary = '#3f51b5';
export const secondary = '#FFC05C';

const theme = createMuiTheme({ palette: { primary: { main: primary }, secondary: { main: secondary } } });
<% if(redux) { -%>
export interface State {
    readonly home: HomeState;
}

export const initialState: State = {
    home: initialHomeState,
};

const reducer = persistReducer(
    { key: 'root', storage: persistStorage, whitelist: ['home'] },
    combineReducers({
        home: homeReducer,
    }),
);

const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
    const middlewares: Middleware[] = [sagaMiddleware];
    if (process.env.NODE_ENV === `development`) middlewares.push(createLogger());

    const composeEnhancer = composeWithDevTools({});
    const enhancer = composeEnhancer(applyMiddleware(...middlewares));
    return createStore(reducer, initialState, enhancer);
};

const initStore = (): { store: Store; persistor: Persistor } => {
    const store = configureStore();
    const persistor = persistStore(store);
    const rootSaga = createRootSaga([/* add sagas here */]);
    sagaMiddleware.run(rootSaga);
    return { store, persistor };
};
<% } -%>

// eslint-disable-next-line react/display-name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapWithProvider = ({ element }: any) => {
    <% if(redux) { -%>// Instantiating store in `wrapRootElement` handler ensures:
    //  - there is fresh store for each SSR page
    //  - it will be called only once in browser, when React mounts
    const { store, persistor } = initStore();
    <% } -%>
    return (
        <HelmetProvider>
            <ThemeProvider {...{ theme }}>
                <SnackbarProvider>
                    <% if(redux) { -%><PersistGate loading={null} persistor={persistor}>
                        <Provider store={store}>
                            {element}
                        </Provider>    
                    </PersistGate>
                    <% } else { -%>
                    {element}
            <% } -%></SnackbarProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
};

export default wrapWithProvider;
