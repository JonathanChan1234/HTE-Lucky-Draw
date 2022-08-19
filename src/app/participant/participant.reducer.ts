import { createReducer, on } from '@ngrx/store';
import { Participant } from './participant';
import { ParticipantAction } from './participant.action';
import { ParticipantSearchFilter } from './participant.service';

export interface AppState {
    participant: ParticipantState;
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

export const participantReducer = createReducer(
    initialState,
    on(ParticipantAction.setLoading, (state) => ({ ...state, loading: true })),
    on(
        ParticipantAction.loadParticipantSuccess,
        (state, { participantData }) => ({
            ...state,
            loading: false,
            error: null,
            participants: participantData.participants,
            reachStart: participantData.reachStart,
            reachEnd: participantData.reachEnd,
        })
    ),
    on(ParticipantAction.loadParticipantError, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(ParticipantAction.setParticipantFilter, (state, { filter }) => ({
        ...state,
        pageOption: {
            ...state.pageOption,
            paginator: undefined,
            filter,
        },
    })),
    on(ParticipantAction.goToPreviousPage, (state) =>
        state.reachStart
            ? state
            : {
                  ...state,
                  pageOption: {
                      ...state.pageOption,
                      paginator: {
                          type: 'endBefore',
                          id: state.participants[state.participants.length - 1]
                              .id,
                      },
                  },
              }
    ),
    on(ParticipantAction.goToNexPage, (state) =>
        state.reachStart
            ? {
                  ...state,
                  pageOption: {
                      ...state.pageOption,
                      paginator: {
                          type: 'startAfter',
                          id: state.participants[0].id,
                      },
                  },
              }
            : state
    ),
    on(ParticipantAction.setPageSize, (state, { pageSize }) => ({
        ...state,
        pageOption: {
            ...state.pageOption,
            pageSize,
            paginator: undefined,
        },
    }))
);
