import { createAction, props } from '@ngrx/store';
import { Draw } from './draw';

export enum DrawActionType {
    LoadDraws = '[Draw Component] LoadDrawList',
    LoadDrawsSuccess = '[Draw API] LoadDrawsSuccess',
    LoadDrawsFailure = '[Draw API] LoadDrawsFailure',
    SetSelectedDraw = '[Draw Component] SetSelectedDraw',
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

const setSelectedDraw = createAction(
    DrawActionType.SetSelectedDraw,
    props<{ drawId: string }>()
);

export const DrawAction = {
    loadDraws,
    loadDrawsSuccess,
    loadDrawsFailure,
    setSelectedDraw,
};
