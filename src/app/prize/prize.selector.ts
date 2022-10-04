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

const selectPageOption = createSelector(
    selectFeature,
    ({ pageOption }) => pageOption
);

const selectFilter = createSelector(
    selectFeature,
    ({ pageOption }) => pageOption.filter
);

const selectPageSize = createSelector(
    selectFeature,
    ({ pageOption }) => pageOption.pageSize
);

const selectHandlingRequest = createSelector(
    selectFeature,
    ({ handlingRequest }) => handlingRequest
);

const selectRequestError = createSelector(
    selectFeature,
    ({ requestError }) => requestError
);

export const PrizeSelector = {
    selectLoading,
    selectError,
    selectPrizeList,
    selectReachStart,
    selectReachEnd,
    selectFilter,
    selectPageSize,
    selectPageOption,
    selectHandlingRequest,
    selectRequestError,
};
