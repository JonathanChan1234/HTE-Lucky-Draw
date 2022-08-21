import { createAction, props } from '@ngrx/store';
import { ParticipantData } from './participant-db.service';
import { ParticipantSearchFilter } from './participant.reducer';

export enum ParticipantActionType {
    LoadParticipants = '[ParticipantList Component] LoadParticipantList',
    SetLoading = '[Participant API] SetLoading',
    LoadParticipantsSuccess = '[Participant API] LoadParticipantListSuccess',
    LoadParticipantsError = '[Participant API] LoadParticipantListError',
    SetParticipantFilter = '[Participant Component] SetParticipantFilter',
    SetPageSize = '[Participant Component] SetPageSize',
    ToPreviousPage = '[Participant Component] ToPreviousPage',
    ToNextPage = '[Participant Component] ToNextPage',
    ReachPageEnd = '[Participant API] ReachPageEnd',
}

const loadParticipant = createAction(
    ParticipantActionType.LoadParticipants,
    props<{ drawId: string }>()
);

const loadParticipantSuccess = createAction(
    ParticipantActionType.LoadParticipantsSuccess,
    props<{ participantData: ParticipantData }>()
);

const loadParticipantError = createAction(
    ParticipantActionType.LoadParticipantsError,
    props<{ error: string }>()
);

const setLoading = createAction(ParticipantActionType.SetLoading);

const setParticipantFilter = createAction(
    ParticipantActionType.SetParticipantFilter,
    props<{ filter: ParticipantSearchFilter }>()
);

const goToPreviousPage = createAction(ParticipantActionType.ToPreviousPage);

const goToNexPage = createAction(ParticipantActionType.ToNextPage);

const reachPageEnd = createAction(ParticipantActionType.ReachPageEnd);

const setPageSize = createAction(
    ParticipantActionType.SetPageSize,
    props<{ pageSize: number }>()
);

export const ParticipantAction = {
    setLoading,
    loadParticipant,
    loadParticipantSuccess,
    loadParticipantError,
    setParticipantFilter,
    reachPageEnd,
    goToNexPage,
    goToPreviousPage,
    setPageSize,
};
