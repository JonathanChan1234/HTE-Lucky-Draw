import { UserInfo } from '@angular/fire/auth';
import { createReducer, on } from '@ngrx/store';
import { Draw } from './draw';
import { DrawAction } from './draw.action';

export interface AppState {
    draw: DrawState;
}
export const drawFeatureKey = 'draw';

export interface DrawState {
    draws?: Draw[];
    loadingDrawList: boolean;
    loadDrawListError?: string;
    handlingRequest: boolean;
    hasMoreDraw: boolean;
    loadingCurrentDraw: boolean;
    loadingCurrentDrawError?: string;
    currentDraw?: Draw;
    user?: UserInfo;
}

const initialState: DrawState = {
    loadingDrawList: false,
    handlingRequest: false,
    hasMoreDraw: false,
    loadingCurrentDraw: false,
};

export const drawReducer = createReducer(
    initialState,
    on(
        DrawAction.loadDraws,
        (state): DrawState => ({
            ...state,
            loadingDrawList: true,
        })
    ),
    on(
        DrawAction.loadDrawsSuccess,
        (state, { draws }): DrawState => ({
            ...state,
            loadingDrawList: false,
            draws,
        })
    ),
    on(
        DrawAction.loadDrawsFailure,
        (state, { error }): DrawState => ({
            ...state,
            loadingDrawList: false,
            loadDrawListError: error,
            draws: undefined,
        })
    ),
    on(
        DrawAction.loadCurrentDraw,
        (state): DrawState => ({
            ...state,
            loadingCurrentDraw: true,
        })
    ),
    on(
        DrawAction.loadCurrentDrawSuccess,
        (state, { draw }): DrawState => ({
            ...state,
            loadingCurrentDraw: false,
            currentDraw: draw,
        })
    ),
    on(
        DrawAction.loadCurrentDrawFailure,
        (state, { error }): DrawState => ({
            ...state,
            loadingCurrentDraw: false,
            loadingCurrentDrawError: error,
            currentDraw: undefined,
        })
    )
);
