import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    switchMap,
} from 'rxjs';
import { CreateDrawDialogComponent } from 'src/app/components/create-draw-dialog/create-draw-dialog.component';
import { DeleteDrawDialogComponent } from 'src/app/components/delete-draw-dialog/delete-draw-dialog.component';
import { Draw } from 'src/app/model/draw';
import { LuckyDrawService } from 'src/app/service/lucky-draw.service';
import { convertDateToDateString } from 'src/app/utility/date';

@Component({
    selector: 'app-lucky-draw',
    templateUrl: './lucky-draw.component.html',
    styleUrls: ['./lucky-draw.component.scss'],
})
export class LuckyDrawComponent implements OnInit {
    refresh$ = new BehaviorSubject<true>(true);
    loading$!: Observable<boolean>;
    draws$!: Observable<Draw[] | null>;
    errMsg = '';

    constructor(
        private router: Router,
        private matDialog: MatDialog,
        private luckyDrawService: LuckyDrawService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.draws$ = this.refresh$.pipe(
            switchMap(() => this.luckyDrawService.getDrawList()),
            catchError((err) => {
                this.errMsg = err.message;
                return of(null);
            }),
            shareReplay(1)
        );
        this.loading$ = merge(
            this.refresh$,
            this.draws$.pipe(
                catchError(() => of(false)),
                map(() => false)
            )
        );
    }

    getReadableDate(date: Date): string {
        return convertDateToDateString(date);
    }

    refresh(): void {
        this.refresh$.next(true);
    }

    openCreateDrawDialog(): void {
        const dialogRef = this.matDialog.open(CreateDrawDialogComponent, {
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            // refresh the list if success
            this.refresh();

            this.snackBar.open(`✔️ Draw created successfully`, 'close', {
                duration: 2000,
            });
        });
    }

    openDeleteDrawDialog(id: string, name: string): void {
        const dialogRef = this.matDialog.open(DeleteDrawDialogComponent, {
            disableClose: true,
            data: { id, name },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            // refresh the list if success
            this.refresh();
            this.snackBar.open(
                `✔️ Draw ${name} deleted successfully`,
                'close',
                {
                    duration: 2000,
                }
            );
        });
    }

    navigateToParticipantPage(drawId: string): Promise<boolean> {
        return this.router.navigate([`draws/participants/${drawId}`]);
    }

    navigateToSettingPage(drawId: string): Promise<boolean> {
        return this.router.navigate([`draws/setting/${drawId}`]);
    }
}
