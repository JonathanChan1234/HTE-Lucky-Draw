import { createReducer, on } from '@ngrx/store';
import { Participant } from './participant';
import { ParticipantAction } from './participant.action';

export interface AppState {
    participant: ParticipantState;
}

export interface ParticipantSearchFilter {
    searchField: 'name' | 'id';
    searchValue: string;
    signedIn?: boolean; // undefined if don't care
    prizeWinner?: boolean; // undefined if don't care
}

export interface ParticipantState {
    participants: Participant[];
    loading: boolean;
    error: string | null;
    pageOption: {
        filter: ParticipantSearchFilter;
        pageSize: number;
        paginator?: {
            id: string;
            type: 'startAfter' | 'endBefore';
        };
    };
    reachStart: boolean;
    reachEnd: boolean;
}

const initialState: ParticipantState = {
    participants: [],
    loading: false,
    error: null,
    pageOption: {
        filter: {
            searchField: 'id',
            searchValue: '',
        },
        pageSize: 1,
    },
    reachStart: true,
    reachEnd: true,
};

export const participantFeatureKey = 'participant';

export const participantReducer = createReducer(
    initialState,
    on(
        ParticipantAction.loadParticipant,
        (state): ParticipantState => ({ ...state, loading: true })
    ),
    on(
        ParticipantAction.loadParticipantSuccess,
        (
            state,
            { participantData: { participants, reachStart, reachEnd } }
        ): ParticipantState => ({
            ...state,
            loading: false,
            error: null,
            participants: participants,
            reachStart: reachStart,
            reachEnd: reachEnd,
        })
    ),
    on(
        ParticipantAction.loadParticipantError,
        (state, { error }): ParticipantState => ({
            ...state,
            loading: false,
            participants: [],
            error,
        })
    ),
    on(
        ParticipantAction.setParticipantFilter,
        (state, { filter }): ParticipantState =>
            isParticipantFilterEqual(state.pageOption.filter, filter)
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
        ParticipantAction.goToPreviousPage,
        (state): ParticipantState =>
            state.reachStart
                ? state
                : {
                      ...state,
                      pageOption: {
                          ...state.pageOption,
                          paginator:
                              state.participants.length === 0
                                  ? undefined
                                  : {
                                        type: 'endBefore',
                                        id: state.participants[0].id,
                                    },
                      },
                  }
    ),
    on(
        ParticipantAction.goToNextPage,
        (state): ParticipantState =>
            state.reachEnd
                ? state
                : {
                      ...state,
                      pageOption: {
                          ...state.pageOption,
                          paginator:
                              state.participants.length === 0
                                  ? undefined
                                  : {
                                        type: 'startAfter',
                                        id: state.participants[
                                            state.participants.length - 1
                                        ].id,
                                    },
                      },
                  }
    ),
    on(
        ParticipantAction.setPageSize,
        (state, { pageSize }): ParticipantState => ({
            ...state,
            pageOption: {
                ...state.pageOption,
                pageSize,
                paginator: undefined,
            },
        })
    )
);

const isParticipantFilterEqual = (
    filter: ParticipantSearchFilter,
    newFilter: ParticipantSearchFilter
): boolean => {
    return (
        filter.prizeWinner === newFilter.prizeWinner &&
        filter.searchField === newFilter.searchField &&
        filter.searchValue === newFilter.searchValue &&
        filter.signedIn === newFilter.signedIn
    );
};
