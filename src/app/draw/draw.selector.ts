import { createFeatureSelector, createSelector } from '@ngrx/store';
import { drawFeatureKey, DrawState } from './draw.reducer';

const selectFeature = createFeatureSelector<DrawState>(drawFeatureKey);

const selectLoading = createSelector(selectFeature, ({ loading }) => loading);

const selectError = createSelector(selectFeature, ({ error }) => error);

const selectDraws = createSelector(selectFeature, ({ draws }) => draws);

export const DrawSelector = {
    selectLoading,
    selectError,
    selectDraws,
};
