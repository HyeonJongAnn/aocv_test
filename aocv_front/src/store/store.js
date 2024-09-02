import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userSlice from '../slices/userSlice';
import ItemSlice from '../slices/ItemSlice';
import ReviewSlice from '../slices/ReviewSlice';
import CartSlice from '../slices/CartSlice';
import NoticeSlice from '../slices/NoticeSlice';
import OrderSlice from '../slices/OrderSlice';
// import reviewSlice from '../slices/reviewSlice';
// import communitySlice from '../slices/communitySlice';
// import travelSlice from "../slices/travelSlice";
// import chatSlice from "../slices/chatSlice";
// import chatRoomSlice from "../slices/chatRoomSlice";
// import recruitmentSlice from "../slices/recruitmentSlice";

const persistConfig = {
    key: 'root',
    storage: storageSession,
};

const reducers = combineReducers({
    user: userSlice,
    item: ItemSlice,
    review: ReviewSlice,
    cart: CartSlice,
    notice: NoticeSlice,
    order: OrderSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
  
