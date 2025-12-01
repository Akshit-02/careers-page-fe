import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Amplify } from "aws-amplify";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import companySlice from "./slices/companySlice";
import awsExports from "../config/aws-export";

Amplify.configure(awsExports, { ssr: true });

const rootReducer = combineReducers({
  company: companySlice,
});

const persistConfig = {
  key: "careerPage",
  storage,
  whitelist: ["company"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
