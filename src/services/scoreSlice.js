import { createSlice } from '@reduxjs/toolkit';

const scoreSlice = createSlice({
    name: 'score',
    initialState: {
        highScore: 0,
    },
    reducers: {
        updateHighScore: (state, action) => {
            if (action.payload > state.highScore) {
                state.highScore = action.payload;
            }
        },
        resetHighScore: (state) => {
            state.highScore = 0;
        }
    }
});

export const { updateHighScore, resetHighScore } = scoreSlice.actions;
export default scoreSlice.reducer;