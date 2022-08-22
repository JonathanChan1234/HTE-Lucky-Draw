import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Participant } from '../participant';
import { ParticipantDbService } from '../participant-db.service';

interface ParticipantEditFormGroup {
    name: FormControl<string>;
    signedIn: FormControl<boolean>;
    message: FormControl<string>;
}

@Component({
    selector: 'app-participant-edit-dialog',
    templateUrl: './participant-edit-dialog.component.html',
    styleUrls: ['./participant-edit-dialog.component.scss'],
})
export class ParticipantEditDialogComponent implements OnInit {
    form: FormGroup<ParticipantEditFormGroup>;
    loading = false;
    errMsg = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public participant: Participant,
        private matRef: MatDialogRef<ParticipantEditDialogComponent>,
        private participantDbService: ParticipantDbService
    ) {
        this.form = new FormGroup({
            name: new FormControl(participant.name, {
                validators: [Validators.required],
                nonNullable: true,
            }),
            signedIn: new FormControl(participant.signedIn, {
                nonNullable: true,
            }),
            message: new FormControl(participant.message, {
                nonNullable: true,
            }),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    editParticipant(): void {
        if (this.form.invalid) return;
        const { name, signedIn, message } = this.form.value;
        this.matRef.disableClose = true;
        // from(
        //     this.participantDbService.editParticipant(this.drawId, {
        //         id: this.participant.id,
        //         name: name ?? this.participant.name,
        //         signedIn: signedIn ?? this.participant.signedIn,
        //         message: message ?? this.participant.message,
        //     })
        // );
        // TODO: Add editing participant logic
    }
}
