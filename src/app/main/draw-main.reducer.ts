import { createReducer, on } from '@ngrx/store';
import { Participant } from '../participant/participant';
import { Prize } from '../prize/prize';
import { DrawMainAction } from './draw-main.action';

export interface AppState {
    main: MainState;
}

export interface DrawGroup {
    candidates: Participant[];
    winner: Participant;
    prize: Prize;
}

export interface MainState {
    drawId?: string;
    prizes: Prize[];
    loadingPrizeList: boolean;
    loadPrizeError?: string;
    numberOfDraws: number;
    loadingDrawGroups: boolean;
    drawGroups: DrawGroup[];
    loadDrawGroupError?: string;
    animating: boolean;
}

const initialState: MainState = {
    prizes: [],
    loadingPrizeList: false,
    numberOfDraws: 0,
    loadingDrawGroups: false,
    drawGroups: [],
    animating: false,
};

export const mainFeatureKey = 'main';

export const mainReducer = createReducer(
    initialState,
    on(
        DrawMainAction.setDrawId,
        (state, { drawId }): MainState => ({
            drawId,
            ...state,
        })
    ),
    on(
        DrawMainAction.loadPrizes,
        (state): MainState => ({
            ...state,
            loadingPrizeList: true,
            loadPrizeError: undefined,
        })
    ),
    on(
        DrawMainAction.loadPrizesSuccess,
        (state, { prizes }): MainState => ({
            ...state,
            loadingPrizeList: false,
            loadPrizeError: undefined,
            prizes,
        })
    ),
    on(
        DrawMainAction.loadPrizeFailure,
        (state, { error }): MainState => ({
            ...state,
            loadingPrizeList: false,
            loadPrizeError: error,
        })
    ),
    on(
        DrawMainAction.loadDrawGroups,
        (state, { prizes }): MainState => ({
            ...state,
            numberOfDraws: prizes.length,
            loadingDrawGroups: true,
            loadDrawGroupError: undefined,
        })
    ),
    on(
        DrawMainAction.loadDrawGroupsSuccess,
        (state, { drawGroups }): MainState => ({
            ...state,
            drawGroups,
            loadingDrawGroups: false,
            loadDrawGroupError: undefined,
        })
    ),
    on(
        DrawMainAction.loadDrawGroupsError,
        (state, { error }): MainState => ({
            ...state,
            loadingDrawGroups: false,
            loadDrawGroupError: error,
        })
    ),
    on(
        DrawMainAction.clearDrawGroups,
        (state): MainState => ({
            ...state,
            drawGroups: [],
            loadingDrawGroups: false,
            loadDrawGroupError: undefined,
        })
    ),
    on(
        DrawMainAction.setAnimating,
        (state, { animating }): MainState => ({
            ...state,
            animating,
            loadingDrawGroups: false,
        })
    )
);
