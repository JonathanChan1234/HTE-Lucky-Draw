import { createAction, props } from '@ngrx/store';
import { Participant } from './participant';
export enum ParticipantActionType {
    LoadParticipants = '[ParticipantList Component] LoadParticipantList',
    SetLoadingState = '[Participant API] SetLoadingState',
    LoadParticipantsSuccess = '[Participant API] LoadParticipantListSuccess',
    LoadParticipantsError = '[Participant API] LoadParticipantListError',
}

const loadParticipant = createAction(
    ParticipantActionType.LoadParticipants,
    props<{ drawId: string }>()
);

const loadParticipantSuccess = createAction(
    ParticipantActionType.LoadParticipantsSuccess,
    props<{ participants: Participant[] }>()
);

const loadParticipantError = createAction(
    ParticipantActionType.LoadParticipantsError,
    props<{ error: string }>()
);
const setLoading = createAction(ParticipantActionType.SetLoadingState);
export const ParticipantAction = {
    setLoading,
    loadParticipant,
    loadParticipantSuccess,
    loadParticipantError,
};
