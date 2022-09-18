import { createFeatureSelector, createSelector } from '@ngrx/store';
import { mainFeatureKey, MainState } from './draw-main.reducer';

const selectFeature = createFeatureSelector<MainState>(mainFeatureKey);

const selectLoadingPrizeList = createSelector(
    selectFeature,
    ({ loadingPrizeList }) => loadingPrizeList
);

const selectLoadingPrizeError = createSelector(
    selectFeature,
    ({ loadPrizeError }) => loadPrizeError
);

const selectPrizes = createSelector(selectFeature, ({ prizes }) => prizes);

const selectLoadingDrawGroups = createSelector(
    selectFeature,
    ({ loadingDrawGroups }) => loadingDrawGroups
);

const selectDrawGroups = createSelector(
    selectFeature,
    ({ drawGroups }) => drawGroups
);

const selectLoadDrawGroupError = createSelector(
    selectFeature,
    ({ loadDrawGroupError }) => loadDrawGroupError
);

const selectAnimating = createSelector(
    selectFeature,
    ({ animating }) => animating
);

const selectPrizeSelectedDisabled = createSelector(
    selectAnimating,
    selectLoadingDrawGroups,
    (animating, loadingDrawGroups) => animating || loadingDrawGroups
);

export const DrawMainSelector = {
    selectLoadingPrizeList,
    selectLoadingPrizeError,
    selectPrizes,
    selectLoadingDrawGroups,
    selectDrawGroups,
    selectLoadDrawGroupError,
    selectAnimating,
    selectPrizeSelectedDisabled,
};
