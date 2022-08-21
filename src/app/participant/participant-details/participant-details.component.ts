import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { convertDateToDateString } from 'src/app/utility/date';
import { Participant } from '../participant';

export interface ParticipantDetailsData {
    participant: Participant;
}

@Component({
    selector: 'app-participant-details',
    templateUrl: './participant-details.component.html',
    styleUrls: ['./participant-details.component.scss'],
})
export class ParticipantDetailsComponent implements OnInit {
    participant: Participant;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ParticipantDetailsData,
        public dialogRef: MatDialogRef<ParticipantDetailsComponent>
    ) {
        this.participant = data.participant;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    signedInDate(): string {
        if (!this.participant.signedInAt) return '';
        return convertDateToDateString(this.participant.signedInAt.toDate());
    }
}
