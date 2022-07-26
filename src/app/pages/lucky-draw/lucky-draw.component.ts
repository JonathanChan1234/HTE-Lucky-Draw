import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    from,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    switchMap,
} from 'rxjs';
import { CreateDrawDialogComponent } from 'src/app/components/create-draw-dialog/create-draw-dialog.component';
import { Draw } from 'src/app/model/draw';
import { AuthService } from 'src/app/service/auth.service';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';
import { convertDateToDateString } from 'src/app/utils/date';

@Component({
    selector: 'app-lucky-draw',
    templateUrl: './lucky-draw.component.html',
    styleUrls: ['./lucky-draw.component.scss'],
})
export class LuckyDrawComponent implements OnInit {
    refresh$ = new BehaviorSubject<true>(true);
    loading$!: Observable<boolean>;
    draws$!: Observable<Draw[] | null>;
    error$!: Observable<Error | null>;

    constructor(
        private router: Router,
        private authService: AuthService,
        private matDialog: MatDialog,
        private luckyDrawService: LuckyDrawService
    ) {}

    ngOnInit(): void {
        this.draws$ = this.refresh$.pipe(
            switchMap(() =>
                from(this.luckyDrawService.getDrawList()).pipe(shareReplay(1))
            ),
            catchError(() => of(null))
        );
        this.loading$ = merge(
            this.refresh$,
            this.draws$.pipe(
                catchError(() => of(false)),
                map(() => false)
            )
        );
        this.error$ = this.draws$.pipe(
            catchError((error) => error),
            map(() => null)
        );
    }
    openCreateDrawDialog(): void {
        const dialogRef = this.matDialog.open(CreateDrawDialogComponent, {});

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            console.log(result);
        });
    }

    getReadableDate(date: Date): string {
        return convertDateToDateString(date);
    }

    refresh(): void {
        this.refresh$.next(true);
    }
}
