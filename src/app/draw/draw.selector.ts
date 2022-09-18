import { createFeatureSelector, createSelector } from '@ngrx/store';
import { drawFeatureKey, DrawState } from './draw.reducer';

const selectFeature = createFeatureSelector<DrawState>(drawFeatureKey);

const selectLoadingDrawList = createSelector(
    selectFeature,
    ({ loadingDrawList }) => loadingDrawList
);

const selectLoadDrawListError = createSelector(
    selectFeature,
    ({ loadDrawListError }) => loadDrawListError
);

const selectDrawList = createSelector(selectFeature, ({ draws }) => draws);

const selectCurrentDraw = createSelector(
    selectFeature,
    ({ currentDraw }) => currentDraw
);

const selectLoadingCurrentDraw = createSelector(
    selectFeature,
    ({ loadingCurrentDraw }) => loadingCurrentDraw
);

const selectLoadCurrentDrawError = createSelector(
    selectFeature,
    ({ loadingCurrentDrawError }) => loadingCurrentDrawError
);

export const DrawSelector = {
    selectLoadingDrawList,
    selectLoadDrawListError,
    selectDrawList,
    selectCurrentDraw,
    selectLoadingCurrentDraw,
    selectLoadCurrentDrawError,
};
