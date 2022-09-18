import { createAction, props } from '@ngrx/store';
import { Draw } from './draw';
import { DrawList } from './lucky-draw.service';

export enum DrawActionType {
    LoadDraws = '[Draw Component] LoadDrawList',
    LoadMoreDraws = '[Draw Component] LoadMoreDraws',
    LoadDrawsSuccess = '[Draw API] LoadDrawsSuccess',
    LoadMoreDrawSuccess = '[Draw API] LoadMoreDrawSuccess',
    LoadDrawsFailure = '[Draw API] LoadDrawsFailure',
    loadCurrentDraw = '[Draw Component] LoadCurrentDraw',
    LoadCurrentDrawSuccess = '[Draw Component] LoadCurrentDrawSuccess',
    LoadCurrentDrawFailure = '[Draw Component] LoadCurrentDrawFailure',
    UpdateDrawSettings = '[Draw Component] UpdateDrawSettings',
    CreateDrawSuccess = '[Draw Component] CreateDrawSuccess',
    DeleteDrawSuccess = '[Draw Component] DeleteDrawSuccess',
}

const loadDraws = createAction(DrawActionType.LoadDraws);

const loadMoreDraws = createAction(DrawActionType.LoadMoreDraws);

const loadDrawsSuccess = createAction(
    DrawActionType.LoadDrawsSuccess,
    props<{ draws: DrawList }>()
);

const loadMoreDrawsSuccess = createAction(
    DrawActionType.LoadMoreDrawSuccess,
    props<{ draws: DrawList }>()
);

const loadDrawsFailure = createAction(
    DrawActionType.LoadDrawsFailure,
    props<{ error: string }>()
);

const loadCurrentDraw = createAction(
    DrawActionType.loadCurrentDraw,
    props<{ drawId: string }>()
);

const loadCurrentDrawSuccess = createAction(
    DrawActionType.LoadCurrentDrawSuccess,
    props<{ draw: Draw }>()
);

const loadCurrentDrawFailure = createAction(
    DrawActionType.LoadCurrentDrawFailure,
    props<{ error: string }>()
);

const createDrawSuccess = createAction(
    DrawActionType.CreateDrawSuccess,
    props<{ name: string }>()
);

const deleteDrawSuccess = createAction(
    DrawActionType.DeleteDrawSuccess,
    props<{ drawId: string }>()
);

const updateDrawSettings = createAction(
    DrawActionType.UpdateDrawSettings,
    props<{ draw: Draw }>()
);

export const DrawAction = {
    loadDraws,
    loadMoreDraws,
    loadDrawsSuccess,
    loadMoreDrawsSuccess,
    loadDrawsFailure,
    loadCurrentDraw,
    loadCurrentDrawSuccess,
    loadCurrentDrawFailure,
    createDrawSuccess,
    deleteDrawSuccess,
    updateDrawSettings,
};
