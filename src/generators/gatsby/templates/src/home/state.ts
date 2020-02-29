import { createSlice } from '@reduxjs/toolkit';

export interface HomeState {}
export const initialHomeState: HomeState = {};

const homeSlice = createSlice({
    name: 'home',
    initialState: initialHomeState,
    reducers: {},
});

export const homeActions = homeSlice.actions;
export const homeReducer = homeSlice.reducer;
export const homeSliceName = homeSlice.name;
export default homeSlice;