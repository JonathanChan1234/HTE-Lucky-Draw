import { createAction, props } from '@ngrx/store';
import { ParticipantData } from './participant-db.service';
import { ParticipantSearchFilter } from './participant.reducer';

export enum ParticipantActionType {
    SetDrawId = '[Participant Component] SetDrawId',
    LoadParticipants = '[Participant Component] LoadParticipantList',
    LoadParticipantsSuccess = '[Participant API] LoadParticipantListSuccess',
    LoadParticipantsError = '[Participant API] LoadParticipantListError',
    SetParticipantFilter = '[Participant Component] SetParticipantFilter',
    SetPageSize = '[Participant Component] SetPageSize',
    ToPreviousPage = '[Participant Component] ToPreviousPage',
    ToNextPage = '[Participant Component] ToNextPage',
}

const setDrawId = createAction(
    ParticipantActionType.SetDrawId,
    props<{ drawId: string }>()
);

const setParticipantFilter = createAction(
    ParticipantActionType.SetParticipantFilter,
    props<{ filter: ParticipantSearchFilter }>()
);

const goToPreviousPage = createAction(ParticipantActionType.ToPreviousPage);

const goToNextPage = createAction(ParticipantActionType.ToNextPage);

const loadParticipant = createAction(ParticipantActionType.LoadParticipants);

const loadParticipantSuccess = createAction(
    ParticipantActionType.LoadParticipantsSuccess,
    props<{ participantData: ParticipantData }>()
);

const loadParticipantError = createAction(
    ParticipantActionType.LoadParticipantsError,
    props<{ error: string }>()
);

const setPageSize = createAction(
    ParticipantActionType.SetPageSize,
    props<{ pageSize: number }>()
);

export const ParticipantAction = {
    setDrawId,
    setPageSize,
    setParticipantFilter,
    loadParticipant,
    loadParticipantSuccess,
    loadParticipantError,
    goToNextPage,
    goToPreviousPage,
};
