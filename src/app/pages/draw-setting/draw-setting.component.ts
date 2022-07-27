import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
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
    throwError,
} from 'rxjs';
import { Draw } from 'src/app/model/draw';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';

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
    error$!: Observable<Error | undefined>;
    updateRequest$: Observable<true> = of(true);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private luckyDrawService: LuckyDrawService
    ) {}

    ngOnInit(): void {
        this.draw$ = this.refresh$.pipe(
            switchMap(() => this.route.params),
            switchMap((params) =>
                !!params['drawId']
                    ? this.luckyDrawService.getDrawById(params['drawId'])
                    : throwError(() => new Error('Empty Draw ID'))
            ),
            catchError(() => of(undefined)),
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

        this.error$ = merge(
            this.draw$.pipe(
                map(() => undefined),
                catchError((err) => of(err))
            )
        );
    }

    refresh(): void {
        this.refresh$.next(true);
    }

    changeSignInRequiredSetting({ checked }: MatSlideToggleChange): void {
        this.request$.next(true);
        this.route.params
            .pipe(
                switchMap((params) =>
                    !!params['drawId']
                        ? from(
                              this.luckyDrawService.updateSignInRequiredAsync(
                                  params['drawId'],
                                  checked
                              )
                          )
                        : throwError(() => new Error('Empty Draw Id'))
                )
            )
            .subscribe({
                next: () => {
                    this.request$.next(false);
                    this.refresh();
                },
                error: (err) => {
                    this.request$.next(false);
                    console.error(err);
                },
            });
    }

    changeLockSetting({ checked }: MatSlideToggleChange): void {
        this.request$.next(true);
        this.route.params
            .pipe(
                switchMap((params) =>
                    !!params['drawId']
                        ? from(
                              this.luckyDrawService.updateLockAsync(
                                  params['drawId'],
                                  checked
                              )
                          )
                        : throwError(() => new Error('Empty Draw Id'))
                )
            )
            .subscribe({
                next: () => {
                    this.request$.next(false);
                    this.refresh();
                },
                error: (err) => {
                    this.request$.next(false);
                    console.error(err);
                },
            });
    }

    navigateToHomePage(): Promise<boolean> {
        return this.router.navigate(['draws']);
    }
}
