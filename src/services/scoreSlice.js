import { createSlice } from '@reduxjs/toolkit';

const scoreSlice = createSlice({
    name: 'score',
    initialState: {
        highScore: 0,
    },
    reducers: {
        updateHighScore: (state, action) => {
            const newScore = action.payload;

            if (state.highScore === 0 || newScore < state.highScore) {
                state.highScore = newScore;
                localStorage.setItem('lolHighScore', newScore);
            }
        },
        resetHighScore: (state) => {
            state.highScore = 0;
        }
    }
});

export const { updateHighScore, resetHighScore } = scoreSlice.actions;
export default scoreSlice.reducer;