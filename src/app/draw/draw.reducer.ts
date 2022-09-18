import { UserInfo } from '@angular/fire/auth';
import { createReducer, on } from '@ngrx/store';
import { Draw } from './draw';
import { DrawAction } from './draw.action';

export interface AppState {
    draw: DrawState;
}
export const drawFeatureKey = 'draw';

export interface DrawState {
    draws: Draw[];
    loadingDrawList: boolean;
    loadDrawListError?: string;
    handlingRequest: boolean;
    reachEnd: boolean;
    loadingCurrentDraw: boolean;
    loadingCurrentDrawError?: string;
    currentDraw?: Draw;
    user?: UserInfo;
}

const initialState: DrawState = {
    draws: [],
    loadingDrawList: false,
    handlingRequest: false,
    reachEnd: true,
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
        DrawAction.loadMoreDraws,
        (state): DrawState => ({
            ...state,
            loadingDrawList: true,
        })
    ),
    on(
        DrawAction.loadDrawsSuccess,
        (state, { draws: { draws, reachEnd } }): DrawState => ({
            ...state,
            loadingDrawList: false,
            draws,
            reachEnd,
        })
    ),
    on(
        DrawAction.loadMoreDrawsSuccess,
        (state, { draws: { draws, reachEnd } }): DrawState => ({
            ...state,
            loadingDrawList: false,
            draws: [...state.draws].concat(draws),
            reachEnd,
        })
    ),
    on(
        DrawAction.loadDrawsFailure,
        (state, { error }): DrawState => ({
            ...state,
            loadingDrawList: false,
            loadDrawListError: error,
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
    ),
    on(
        DrawAction.deleteDrawSuccess,
        (state, { drawId }): DrawState => ({
            ...state,
            draws: state.draws.filter((draw) => draw.id !== drawId),
        })
    ),
    on(
        DrawAction.updateDrawSettings,
        (state, { draw }): DrawState => ({
            ...state,
            currentDraw: draw,
        })
    )
);
