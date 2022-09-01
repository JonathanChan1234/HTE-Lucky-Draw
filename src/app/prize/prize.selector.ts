import { createFeatureSelector, createSelector } from '@ngrx/store';
import { prizeFeatureKey, PrizeState } from './prize.reducer';

const selectFeature = createFeatureSelector<PrizeState>(prizeFeatureKey);

const selectLoading = createSelector(selectFeature, ({ loading }) => loading);

const selectError = createSelector(selectFeature, ({ error }) => error);

const selectPrizeList = createSelector(selectFeature, ({ prizes }) => prizes);

const selectReachStart = createSelector(
    selectFeature,
    ({ reachStart }) => reachStart
);

const selectReachEnd = createSelector(
    selectFeature,
    ({ reachEnd }) => reachEnd
);

const selectDrawId = createSelector(selectFeature, ({ drawId }) => drawId);

const selectPageOption = createSelector(
    selectFeature,
    ({ pageOption }) => pageOption
);

const selectDrawIdAndPageOption = createSelector(
    selectDrawId,
    selectPageOption,
    (drawId, { filter, pageSize, paginator }) => ({
        drawId,
        filter,
        pageSize,
        paginator,
    })
);

const selectHandlingRequest = createSelector(
    selectFeature,
    ({ handlingRequest }) => handlingRequest
);

const selectSnackbarMsg = createSelector(
    selectFeature,
    ({ snackBarMsg }) => snackBarMsg
);

export const PrizeSelector = {
    selectLoading,
    selectError,
    selectPrizeList,
    selectReachStart,
    selectReachEnd,
    selectDrawId,
    selectDrawIdAndPageOption,
    selectHandlingRequest,
    selectSnackbarMsg,
};
