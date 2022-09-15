import { createFeatureSelector, createSelector } from '@ngrx/store';
import { drawFeatureKey, DrawState } from './draw.reducer';

const selectFeature = createFeatureSelector<DrawState>(drawFeatureKey);

const selectLoading = createSelector(selectFeature, ({ loading }) => loading);

const selectError = createSelector(selectFeature, ({ error }) => error);

const selectDraws = createSelector(selectFeature, ({ draws }) => draws);

const selectCurrentDraw = createSelector(
    selectFeature,
    ({ currentDrawId, draws }) => {
        draws ? draws.find((draw) => draw.id === currentDrawId) : undefined;
    }
);

export const DrawSelector = {
    selectLoading,
    selectError,
    selectDraws,
    selectCurrentDraw,
};
