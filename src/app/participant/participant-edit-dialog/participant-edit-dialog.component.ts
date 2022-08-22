import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { ParticipantDbService } from '../participant-db.service';
import { ParticipantDialogData } from '../participant-list/participant-list.component';

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
        @Inject(MAT_DIALOG_DATA) public dialogData: ParticipantDialogData,
        private matRef: MatDialogRef<ParticipantEditDialogComponent>,
        private participantDbService: ParticipantDbService
    ) {
        this.form = new FormGroup({
            name: new FormControl(dialogData.participant.name, {
                validators: [Validators.required],
                nonNullable: true,
            }),
            signedIn: new FormControl(dialogData.participant.signedIn, {
                nonNullable: true,
            }),
            message: new FormControl(dialogData.participant.message, {
                nonNullable: true,
            }),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    editParticipant(): void {
        if (this.form.invalid) return;
        const { name, signedIn, message } = this.form.value;

        // check if the form values are identical to the original value
        const {
            name: originalName,
            signedIn: originalSignedIn,
            message: originalMessage,
        } = this.dialogData.participant;
        if (
            name === originalName &&
            signedIn === originalSignedIn &&
            originalMessage === message
        ) {
            this.matRef.close();
            return;
        }

        this.loading = true;
        from(
            this.participantDbService.editParticipant(this.dialogData.drawId, {
                id: this.dialogData.participant.id,
                name: name ?? this.dialogData.participant.name,
                signedIn: signedIn ?? this.dialogData.participant.signedIn,
                message: message ?? this.dialogData.participant.message,
            })
        ).subscribe({
            next: () => {
                this.loading = false;
                this.matRef.close(true);
            },
            error: (error) => {
                this.loading = false;
                this.errMsg = error.message;
            },
        });
    }
}
