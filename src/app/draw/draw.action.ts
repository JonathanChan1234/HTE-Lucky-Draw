import { createAction, props } from '@ngrx/store';
import { Draw } from './draw';

export enum DrawActionType {
    LoadDraws = '[Draw Component] LoadDrawList',
    LoadDrawsSuccess = '[Draw API] LoadDrawsSuccess',
    LoadDrawsFailure = '[Draw API] LoadDrawsFailure',
    loadCurrentDraw = '[Draw Component] LoadCurrentDraw',
    LoadCurrentDrawSuccess = '[Draw Component] LoadCurrentDrawSuccess',
    LoadCurrentDrawFailure = '[Draw Component] LoadCurrentDrawFailure',
}

const loadDraws = createAction(DrawActionType.LoadDraws);

const loadDrawsSuccess = createAction(
    DrawActionType.LoadDrawsSuccess,
    props<{ draws: Draw[] }>()
);

const loadDrawsFailure = createAction(
    DrawActionType.LoadDrawsFailure,
    props<{ error: string }>()
);

const loadCurrentDraw = createAction(
    DrawActionType.loadCurrentDraw,
    props<{ drawId: string }>()
);

const loadCurrentDrawSuccess = createAction(
    DrawActionType.LoadCurrentDrawSuccess,
    props<{ draw: Draw }>()
);

const loadCurrentDrawFailure = createAction(
    DrawActionType.LoadCurrentDrawFailure,
    props<{ error: string }>()
);

export const DrawAction = {
    loadDraws,
    loadDrawsSuccess,
    loadDrawsFailure,
    loadCurrentDraw,
    loadCurrentDrawSuccess,
    loadCurrentDrawFailure,
};
