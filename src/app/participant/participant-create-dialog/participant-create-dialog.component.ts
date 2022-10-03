import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { ParticipantDbService } from '../participant-db.service';

interface ParticipantCreateForm {
    id: FormControl<string>;
    name: FormControl<string>;
    signedIn: FormControl<boolean>;
    message: FormControl<string>;
}

@Component({
    selector: 'app-participant-create-dialog',
    templateUrl: './participant-create-dialog.component.html',
    styleUrls: ['./participant-create-dialog.component.scss'],
})
export class ParticipantCreateDialogComponent implements OnInit {
    form: FormGroup<ParticipantCreateForm>;
    loading = false;
    errMsg = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public drawId: string,
        private dialogRef: MatDialogRef<ParticipantCreateDialogComponent>,
        private readonly participantDbService: ParticipantDbService
    ) {
        this.form = new FormGroup({
            id: new FormControl('', {
                validators: [Validators.required],
                nonNullable: true,
            }),
            name: new FormControl('', {
                validators: [Validators.required],
                nonNullable: true,
            }),
            signedIn: new FormControl(false, { nonNullable: true }),
            message: new FormControl('', {
                validators: [Validators.required],
                nonNullable: true,
            }),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    addParticipant() {
        if (this.form.invalid) return;
        const { id, name, signedIn, message } = this.form.value;
        if (
            id === undefined ||
            name === undefined ||
            signedIn === undefined ||
            message === undefined
        )
            return;
        this.loading = true;
        from(
            this.participantDbService.createParticipant(this.drawId, [
                {
                    id,
                    name,
                    signedIn,
                    message,
                },
            ])
        ).subscribe({
            next: () => {
                this.loading = false;
                this.errMsg = '';
                this.dialogRef.close(true);
            },
            error: (error) => {
                this.loading = false;
                this.errMsg = error.message;
            },
        });
    }
}
