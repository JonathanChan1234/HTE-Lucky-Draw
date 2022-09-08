import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface PrizesSelectionDialogData {
    numberOfPrizes: number;
    defaultValue: number;
}

@Component({
    selector: 'app-prizes-selection-dialog',
    templateUrl: './prizes-selection-dialog.component.html',
    styleUrls: ['./prizes-selection-dialog.component.scss'],
})
export class PrizesSelectionDialogComponent implements OnInit {
    formControl: FormControl<number>;
    items: number[];

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: PrizesSelectionDialogData,
        private matDialogRef: MatDialogRef<PrizesSelectionDialogComponent>
    ) {
        this.formControl = new FormControl(data.defaultValue, {
            validators: [Validators.required],
            nonNullable: true,
        });
        this.items = Array<number>(data.numberOfPrizes)
            .fill(0)
            .map((_x, i) => i);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    setNumberOfPrize(): void {
        if (this.formControl.invalid) return;
        this.matDialogRef.close(this.formControl.value);
    }
}
