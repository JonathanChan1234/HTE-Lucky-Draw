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
    filter: ParticipantSearchFilter;
    pageSize: number;
    participantsCache: Participant[];
    firstId: string | null;
    lastId: string | null;
}

const initialState: ParticipantState = {
    participants: [],
    loading: false,
    error: null,
    filter: {
        searchField: 'id',
        searchValue: '',
    },
    pageSize: 10,
    participantsCache: [],
    firstId: null,
    lastId: null,
};

export const participantReducer = createReducer(
    initialState,
    on(ParticipantAction.setLoading, (state) => ({ ...state, loading: true })),
    on(ParticipantAction.loadParticipantSuccess, (state, { participants }) => ({
        ...state,
        loading: false,
        error: null,
        participants,
    })),
    on(ParticipantAction.loadParticipantError, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);
