import { createAction, props } from '@ngrx/store';
import { PrizeSearchFilter } from './prize.reducer';
import { PrizeList } from './prize.service';

export enum PrizeActionType {
    SetDrawId = '[Prize Component] SetDrawId',
    LoadPrizes = '[Prize Component] LoadPrizeList',
    LoadPrizesSuccess = '[Prize API] LoadPrizeListSuccess',
    LoadPrizesError = '[Prize API] LoadPrizeListError',
    SetPrizeFilter = '[Prize Component] SetPrizeFilter',
    SetPageSize = '[Prize Component] SetPageSize',
    ToPreviousPage = '[Prize Component] ToPreviousPage',
    ToNextPage = '[Prize Component] ToNextPage',
    CreatePrize = '[Prize Component] CreatePrize',
    DeletePrize = '[Prize Component] DeletePrize',
    RequestSuccess = '[Prize Effect] RequestSuccess',
    RequestFailure = '[Prize Effect] RequestFailure',
}

const setDrawId = createAction(
    PrizeActionType.SetDrawId,
    props<{ drawId: string }>()
);

const loadPrizes = createAction(PrizeActionType.LoadPrizes);

const loadPrizeSuccess = createAction(
    PrizeActionType.LoadPrizesSuccess,
    props<{ prizeList: PrizeList }>()
);

const loadPrizeError = createAction(
    PrizeActionType.LoadPrizesError,
    props<{ error: string }>()
);

const setPrizeFilter = createAction(
    PrizeActionType.SetPrizeFilter,
    props<{ filter: PrizeSearchFilter }>()
);

const goToPreviousPage = createAction(PrizeActionType.ToPreviousPage);

const goToNextPage = createAction(PrizeActionType.ToNextPage);

const setPageSize = createAction(
    PrizeActionType.SetPageSize,
    props<{ pageSize: number }>()
);

const createPrize = createAction(
    PrizeActionType.CreatePrize,
    props<{ name: string; sponsor: string; sequence: number }>()
);

const deletePrize = createAction(
    PrizeActionType.DeletePrize,
    props<{ prizeId: string }>()
);

const requestSuccess = createAction(
    PrizeActionType.RequestSuccess,
    props<{ msg: string }>()
);

const requestFailure = createAction(
    PrizeActionType.RequestFailure,
    props<{ msg: string }>()
);

export const PrizeAction = {
    setDrawId,
    setPageSize,
    goToPreviousPage,
    goToNextPage,
    setPrizeFilter,
    loadPrizes,
    loadPrizeSuccess,
    loadPrizeError,
    createPrize,
    deletePrize,
    requestSuccess,
    requestFailure,
};
