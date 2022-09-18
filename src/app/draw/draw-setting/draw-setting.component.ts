import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { Draw } from 'src/app/draw/draw';
import { LuckyDrawService } from 'src/app/draw/lucky-draw.service';
import { DrawAction } from '../draw.action';
import { DrawSelector } from '../draw.selector';

@Component({
    selector: 'app-draw-setting',
    templateUrl: './draw-setting.component.html',
    styleUrls: ['./draw-setting.component.scss'],
})
export class DrawSettingComponent implements OnInit {
    loading = false;
    draw$!: Observable<Draw | undefined>;

    errMsg = '';
    editMode = false;
    nameFormControl: FormControl;

    constructor(
        private readonly store: Store,
        private matSnackBar: MatSnackBar,
        private luckyDrawService: LuckyDrawService
    ) {
        this.nameFormControl = new FormControl('', [
            Validators.required,
            Validators.maxLength(30),
        ]);
    }

    ngOnInit(): void {
        this.draw$ = this.store.select(DrawSelector.selectCurrentDraw);
        this.draw$.subscribe((draw) =>
            this.nameFormControl.setValue(draw?.name)
        );
    }

    changeDrawName(draw: Draw): void {
        // change to edit mode if it isn't
        if (!this.editMode) {
            this.editMode = true;
            return;
        }

        // ignore if the draw name did not change
        if (draw.name === this.nameFormControl.value) {
            this.editMode = false;
            return;
        }

        this.loading = true;
        from(
            this.luckyDrawService.updateDrawNameAsync(
                draw.id,
                this.nameFormControl.value
            )
        ).subscribe({
            next: () => {
                this.loading = false;
                this.editMode = false;
                this.matSnackBar.open('✔️ Change name successfully', 'close', {
                    duration: 2000,
                });
                this.store.dispatch(
                    DrawAction.updateDrawSettings({
                        draw: { ...draw, name: this.nameFormControl.value },
                    })
                );
            },
            error: (err) => {
                this.editMode = false;
                this.loading = false;
                this.matSnackBar.open(`⚠️ ${err.message}`, 'close', {
                    duration: 2000,
                });
            },
        });
    }

    changeSignInRequiredSetting(
        { checked }: MatSlideToggleChange,
        draw: Draw
    ): void {
        this.loading = true;
        from(
            this.luckyDrawService.updateSignInRequiredAsync(draw.id, checked)
        ).subscribe({
            next: () => {
                this.loading = false;
                this.matSnackBar.open(
                    `✔️ Sign in is now ${
                        checked ? 'required' : 'not required'
                    }`,
                    'close',
                    { duration: 2000 }
                );
                this.store.dispatch(
                    DrawAction.updateDrawSettings({
                        draw: { ...draw, signInRequired: checked },
                    })
                );
            },
            error: (err) => {
                this.loading = false;
                this.matSnackBar.open(`⚠️ ${err.message}`, 'close', {
                    duration: 2000,
                });
            },
        });
    }

    changeLockSetting({ checked }: MatSlideToggleChange, draw: Draw): void {
        this.loading = true;
        from(this.luckyDrawService.updateLockAsync(draw.id, checked)).subscribe(
            {
                next: () => {
                    this.loading = false;
                    this.matSnackBar.open(
                        `✔️ Draw is now ${checked ? 'locked' : 'open'}`,
                        'close',
                        { duration: 2000 }
                    );
                    this.store.dispatch(
                        DrawAction.updateDrawSettings({
                            draw: { ...draw, lock: checked },
                        })
                    );
                },
                error: (err) => {
                    this.loading = false;
                    this.matSnackBar.open(`⚠️ ${err.message}`, 'close', {
                        duration: 2000,
                    });
                },
            }
        );
    }
}
