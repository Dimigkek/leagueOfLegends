import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './scoreSlice'; // No dots or slashes needed besides ./

export const store = configureStore({
    reducer: {
        score: scoreReducer,
    },
});