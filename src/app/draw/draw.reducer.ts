import { createReducer, on } from '@ngrx/store';
import { Draw } from './draw';
import { DrawAction } from './draw.action';

export interface AppState {
    draw: DrawState;
}
export const drawFeatureKey = 'draw';

export interface DrawState {
    draws?: Draw[];
    loading: boolean;
    error?: string;
    handlingRequest: boolean;
    hasMoreDraw: boolean;
    selectedDraw?: Draw;
}

const initialState: DrawState = {
    loading: false,
    handlingRequest: false,
    hasMoreDraw: false,
};

export const drawReducer = createReducer(
    initialState,
    on(
        DrawAction.loadDraws,
        (state): DrawState => ({
            ...state,
            loading: true,
        })
    ),
    on(
        DrawAction.loadDrawsSuccess,
        (state, { draws }): DrawState => ({
            ...state,
            loading: false,
            draws,
        })
    ),
    on(
        DrawAction.loadDrawsFailure,
        (state, { error }): DrawState => ({
            ...state,
            loading: false,
            error,
        })
    )
);
