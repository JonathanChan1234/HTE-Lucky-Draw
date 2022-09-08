import { createAction, props } from '@ngrx/store';
import { Prize } from '../prize/prize';
import { DrawGroup } from './draw-main.reducer';

export enum DrawMainActionType {
    SetDrawId = '[DrawMain Component] SetDrawId',
    LoadPrizes = '[DrawMain Component] LoadPrizeList',
    LoadPrizesSuccess = '[DrawMain API] LoadPrizeListSuccess',
    LoadPrizesFailure = '[DrawMain API] LoadPrizeListError',
    LoadDrawGroups = '[DrawMain Component] LoadDrawGroups',
    LoadDrawGroupsSuccess = '[DrawMain Component] LoadDrawGroupsSuccess',
    LoadDrawGroupsFailure = '[DrawMain Component] LoadDrawGroupsFailure',
}

const setDrawId = createAction(
    DrawMainActionType.SetDrawId,
    props<{ drawId: string }>()
);

const loadPrizes = createAction(DrawMainActionType.LoadPrizes);

const loadPrizesSuccess = createAction(
    DrawMainActionType.LoadPrizesSuccess,
    props<{ prizes: Prize[] }>()
);

const loadPrizeFailure = createAction(
    DrawMainActionType.LoadPrizesFailure,
    props<{ error: string }>()
);

const loadWinnerGroups = createAction(
    DrawMainActionType.LoadDrawGroups,
    props<{ prizes: Prize[]; numberOfDraws: number }>()
);

const loadWinnerGroupsSuccess = createAction(
    DrawMainActionType.LoadDrawGroupsSuccess,
    props<{ drawGroups: DrawGroup[] }>()
);

const loadWinnerGroupsError = createAction(
    DrawMainActionType.LoadDrawGroupsFailure,
    props<{ error: string }>()
);

export const DrawMainAction = {
    setDrawId,
    loadPrizes,
    loadPrizesSuccess,
    loadPrizeFailure,
    loadWinnerGroups,
    loadWinnerGroupsSuccess,
    loadWinnerGroupsError,
};
