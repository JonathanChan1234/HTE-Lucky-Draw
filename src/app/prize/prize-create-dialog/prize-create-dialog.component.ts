import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { PrizeService } from '../prize.service';

interface PrizeCreateForm {
    name: FormControl<string>;
    sponsor: FormControl<string>;
    sequence: FormControl<number>;
}

@Component({
    selector: 'app-prize-create-dialog',
    templateUrl: './prize-create-dialog.component.html',
    styleUrls: ['./prize-create-dialog.component.scss'],
})
export class PrizeCreateDialogComponent implements OnInit {
    form: FormGroup<PrizeCreateForm>;

    constructor(
        private prizeService: PrizeService,
        private matDialogRef: MatDialogRef<PrizeCreateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public drawId: string
    ) {
        this.form = new FormGroup({
            name: new FormControl('', {
                validators: [Validators.required],
                nonNullable: true,
            }),
            sponsor: new FormControl('', {
                validators: [Validators.required],
                nonNullable: true,
            }),
            sequence: new FormControl(0, {
                validators: [
                    Validators.required,
                    Validators.pattern(/^[1-9][0-9]*$/), // positive integer with no leading zero
                ],
                nonNullable: true,
            }),
        });
    }

    ngOnInit(): void {
        if (!this.drawId) return;
        from(this.prizeService.getLastSequence(this.drawId)).subscribe({
            next: (sequence) => this.form.patchValue({ sequence }),
            error: (error) => alert(error.message),
        });
    }

    addPrize(): void {
        if (this.form.invalid) return;
        this.matDialogRef.close(this.form.value);
    }
}
