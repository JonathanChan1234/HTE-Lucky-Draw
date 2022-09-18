import { createAction, props } from '@ngrx/store';
import { Prize } from '../prize/prize';
import { DrawGroup } from './draw-main.reducer';

export enum DrawMainActionType {
    LoadPrizes = '[DrawMain Component] LoadPrizeList',
    LoadPrizesSuccess = '[DrawMain API] LoadPrizeListSuccess',
    LoadPrizesFailure = '[DrawMain API] LoadPrizeListError',
    LoadDrawGroups = '[DrawMain Component] LoadDrawGroups',
    ClearDrawGroups = '[DrawMain Component] ClearDrawGroups',
    LoadDrawGroupsSuccess = '[DrawMain Component] LoadDrawGroupsSuccess',
    LoadDrawGroupsFailure = '[DrawMain Component] LoadDrawGroupsFailure',
    SetAnimating = '[DrawMain Component] SetAnimating',
}

const loadPrizes = createAction(DrawMainActionType.LoadPrizes);

const loadPrizesSuccess = createAction(
    DrawMainActionType.LoadPrizesSuccess,
    props<{ prizes: Prize[] }>()
);

const loadPrizeFailure = createAction(
    DrawMainActionType.LoadPrizesFailure,
    props<{ error: string }>()
);

const loadDrawGroups = createAction(
    DrawMainActionType.LoadDrawGroups,
    props<{ prizes: Prize[] }>()
);

const loadDrawGroupsSuccess = createAction(
    DrawMainActionType.LoadDrawGroupsSuccess,
    props<{ drawGroups: DrawGroup[] }>()
);

const loadDrawGroupsError = createAction(
    DrawMainActionType.LoadDrawGroupsFailure,
    props<{ error: string }>()
);

const clearDrawGroups = createAction(DrawMainActionType.ClearDrawGroups);

const setAnimating = createAction(
    DrawMainActionType.SetAnimating,
    props<{ animating: boolean }>()
);

export const DrawMainAction = {
    loadPrizes,
    loadPrizesSuccess,
    loadPrizeFailure,
    loadDrawGroups,
    loadDrawGroupsSuccess,
    loadDrawGroupsError,
    clearDrawGroups,
    setAnimating,
};
