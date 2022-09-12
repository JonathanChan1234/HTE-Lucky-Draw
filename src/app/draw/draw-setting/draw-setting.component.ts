import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    from,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    Subject,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { Draw } from 'src/app/draw/draw';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';

const FETCH_SETTING_MSG = 'Fetching Lucky Draw Setting';
const UPDATE_SETTING_MSG = 'Update Lucky Draw Setting';

@Component({
    selector: 'app-draw-setting',
    templateUrl: './draw-setting.component.html',
    styleUrls: ['./draw-setting.component.scss'],
})
export class DrawSettingComponent implements OnInit {
    refresh$ = new BehaviorSubject<true>(true);
    request$ = new Subject<boolean>();
    loading$!: Observable<boolean>;
    draw$!: Observable<Draw | undefined>;

    errMsg = '';
    loadingMsg: string = FETCH_SETTING_MSG;
    draw?: Draw;
    editMode = false;
    nameFormControl: FormControl;

    constructor(
        private matSnackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        private luckyDrawService: LuckyDrawService
    ) {
        this.nameFormControl = new FormControl('', [
            Validators.required,
            Validators.maxLength(30),
        ]);
    }

    ngOnInit(): void {
        this.draw$ = this.refresh$.pipe(
            tap(() => (this.loadingMsg = FETCH_SETTING_MSG)),
            switchMap(() => this.route.params),
            switchMap((params) =>
                !!params['drawId']
                    ? this.luckyDrawService.getDrawById(params['drawId'])
                    : throwError(() => new Error('Emtpy Draw ID'))
            ),
            catchError((err) => {
                this.errMsg = err.message;
                return of(undefined);
            }),
            shareReplay(1)
        );

        this.loading$ = merge(
            this.refresh$,
            this.request$,
            this.draw$.pipe(
                map(() => false),
                catchError(() => of(false))
            )
        );

        this.draw$.subscribe((draw) => {
            this.draw = draw;
            if (!draw) return;
            this.nameFormControl.setValue(draw.name);
        });
    }

    refresh(): void {
        this.refresh$.next(true);
    }

    changeDrawName(): void {
        // change to edit mode if it isn't
        if (!this.editMode) {
            this.editMode = true;
            return;
        }

        // ignore if the draw name did not change
        if (this.draw?.name === this.nameFormControl.value) {
            this.editMode = false;
            return;
        }

        if (!this.draw) return;

        this.loadingMsg = UPDATE_SETTING_MSG;
        this.request$.next(true);
        from(
            this.luckyDrawService.updateDrawNameAsync(
                this.draw.id,
                this.nameFormControl.value
            )
        ).subscribe({
            next: () => {
                this.request$.next(false);
                this.editMode = false;
                this.matSnackBar.open('✔️ Change name successfully', 'close', {
                    duration: 2000,
                });
                this.refresh();
            },
            error: (err) => {
                this.editMode = false;
                this.request$.next(false);
                this.matSnackBar.open(`⚠️ ${err.message}`, 'close', {
                    duration: 2000,
                });
            },
        });
    }

    changeSignInRequiredSetting({ checked }: MatSlideToggleChange): void {
        if (!this.draw) return;

        this.request$.next(true);
        this.loadingMsg = UPDATE_SETTING_MSG;
        from(
            this.luckyDrawService.updateSignInRequiredAsync(
                this.draw.id,
                checked
            )
        ).subscribe({
            next: () => {
                this.request$.next(false);
                this.matSnackBar.open(
                    `✔️ Sign in is now ${
                        checked ? 'required' : 'not required'
                    }`,
                    'close',
                    { duration: 2000 }
                );
                this.refresh();
            },
            error: (err) => {
                this.request$.next(false);
                this.matSnackBar.open(`⚠️ ${err.message}`, 'close', {
                    duration: 2000,
                });
            },
        });
    }

    changeLockSetting({ checked }: MatSlideToggleChange): void {
        if (!this.draw) return;

        this.loadingMsg = UPDATE_SETTING_MSG;
        this.request$.next(true);
        from(
            this.luckyDrawService.updateLockAsync(this.draw.id, checked)
        ).subscribe({
            next: () => {
                this.request$.next(false);
                this.matSnackBar.open(
                    `✔️ Draw is now ${checked ? 'locked' : 'open'}`,
                    'close',
                    { duration: 2000 }
                );
                this.refresh();
            },
            error: (err) => {
                this.request$.next(false);
                this.matSnackBar.open(`⚠️ ${err.message}`, 'close', {
                    duration: 2000,
                });
            },
        });
    }

    navigateToHomePage(): Promise<boolean> {
        return this.router.navigate(['draws']);
    }
}
