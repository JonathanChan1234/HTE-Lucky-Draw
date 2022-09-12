import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LuckyDrawService } from 'src/app/draw/lucky-draw.service';

@Component({
    selector: 'create-draw-dialog',
    templateUrl: './create-draw-dialog.component.html',
    styleUrls: ['./create-draw-dialog.component.scss'],
})
export class CreateDrawDialogComponent {
    formGroup: FormGroup;
    errMsg = '';
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<CreateDrawDialogComponent>,
        private luckyDrawService: LuckyDrawService
    ) {
        this.formGroup = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.maxLength(30),
            ]),
        });
    }

    createNewDraw(): void {
        // ignore the invalid result
        if (this.formGroup.invalid) return;
        const { name } = this.formGroup.value;
        if (name === null) return;

        this.loading = true;
        this.errMsg = '';
        this.luckyDrawService.createNewDraw(name).subscribe({
            next: () => {
                this.loading = false;
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.loading = false;
                this.errMsg = err.message;
            },
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
