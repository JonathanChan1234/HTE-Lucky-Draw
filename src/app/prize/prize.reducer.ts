import { createReducer, on } from '@ngrx/store';
import { isEqual } from 'lodash';
import { Prize } from './prize';
import { PrizeAction } from './prize.action';

export interface AppState {
    prize: PrizeState;
}

export interface PrizeSearchFilter {
    searchValue: string;
    assigned?: boolean;
}

export interface PrizePaginatorOption {
    id: string;
    type: 'startAfter' | 'endBefore';
}

export interface PrizeState {
    drawId?: string;
    prizes: Prize[];
    loading: boolean;
    handlingRequest: boolean;
    snackBarMsg?: { success: boolean; msg: string };
    error: string | null;
    pageOption: {
        filter: PrizeSearchFilter;
        pageSize: number;
        paginator?: PrizePaginatorOption;
    };
    reachStart: boolean;
    reachEnd: boolean;
}

const initialState: PrizeState = {
    prizes: [],
    loading: false,
    handlingRequest: false,
    error: null,
    pageOption: {
        filter: {
            searchValue: '',
        },
        pageSize: 1,
    },
    reachStart: true,
    reachEnd: true,
};

export const prizeFeatureKey = 'prize';

export const prizeReducer = createReducer(
    initialState,
    on(
        PrizeAction.setDrawId,
        (state, { drawId }): PrizeState => ({
            ...state,
            drawId,
        })
    ),
    on(
        PrizeAction.loadPrizes,
        (state): PrizeState => ({
            ...state,
            loading: true,
        })
    ),
    on(
        PrizeAction.setPrizeFilter,
        (state, { filter }): PrizeState =>
            isEqual(state.pageOption.filter, filter)
                ? state
                : {
                      ...state,
                      pageOption: {
                          ...state.pageOption,
                          paginator: undefined,
                          filter,
                      },
                  }
    ),
    on(
        PrizeAction.goToPreviousPage,
        (state): PrizeState =>
            state.reachStart
                ? state
                : {
                      ...state,
                      pageOption: {
                          ...state.pageOption,
                          paginator:
                              state.prizes.length === 0
                                  ? undefined
                                  : {
                                        type: 'endBefore',
                                        id: state.prizes[
                                            state.prizes.length - 1
                                        ].id,
                                    },
                      },
                  }
    ),
    on(
        PrizeAction.goToNextPage,
        (state): PrizeState =>
            state.reachEnd
                ? state
                : {
                      ...state,
                      pageOption: {
                          ...state.pageOption,
                          paginator:
                              state.prizes.length === 0
                                  ? undefined
                                  : {
                                        type: 'startAfter',
                                        id: state.prizes[0].id,
                                    },
                      },
                  }
    ),
    on(
        PrizeAction.setPageSize,
        (state, { pageSize }): PrizeState => ({
            ...state,
            pageOption: {
                ...state.pageOption,
                pageSize,
                paginator: undefined,
            },
        })
    ),
    on(
        PrizeAction.loadPrizeSuccess,
        (
            state,
            { prizeList: { prizes, reachStart, reachEnd } }
        ): PrizeState => ({
            ...state,
            loading: false,
            prizes,
            reachStart,
            reachEnd,
        })
    ),
    on(
        PrizeAction.loadPrizeError,
        (state, { error }): PrizeState => ({
            ...state,
            loading: false,
            error,
        })
    ),
    on(
        PrizeAction.createPrize,
        (state): PrizeState => ({
            ...state,
            handlingRequest: true,
        })
    ),
    on(
        PrizeAction.requestSuccess,
        (state, { msg }): PrizeState => ({
            ...state,
            handlingRequest: false,
            snackBarMsg: { success: true, msg },
        })
    ),
    on(
        PrizeAction.requestFailure,
        (state, { msg }): PrizeState => ({
            ...state,
            handlingRequest: false,
            snackBarMsg: { success: false, msg },
        })
    )
);
