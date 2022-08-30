import { createAction, props } from '@ngrx/store';
import { ParticipantActionType } from '../participant/participant.action';
import { PrizeSearchFilter } from './prize.reducer';

export enum PrizeActionType {
    SetDrawId = '[Prize Component] SetDrawId',
    LoadPrize = '[Prize Component] LoadPrizeList',
    LoadPrizesSuccess = '[Prize API] LoadPrizeListSuccess',
    LoadPrizesError = '[Prize API] LoadPrizeListError',
    SetPrizeFilter = '[Prize Component] SetPrizeFilter',
    SetPageSize = '[Prize Component] SetPageSize',
    ToPreviousPage = '[Prize Component] ToPreviousPage',
    ToNextPage = '[Prize Component] ToNextPage',
}

const setDrawId = createAction(
    PrizeActionType.SetDrawId,
    props<{ drawId: string }>()
);

const loadPrize = createAction(PrizeActionType.LoadPrize);

const setPrizeFilter = createAction(
    PrizeActionType.SetPrizeFilter,
    props<{ filter: PrizeSearchFilter }>()
);

const goToPreviousPage = createAction(PrizeActionType.ToPreviousPage);

const goToNextPage = createAction(PrizeActionType.ToNextPage);

const setPageSize = createAction(
    ParticipantActionType.SetPageSize,
    props<{ pageSize: number }>()
);

export const PrizeAction = {
    setDrawId,
    setPageSize,
    goToPreviousPage,
    goToNextPage,
    setPrizeFilter,
    loadPrize,
};
