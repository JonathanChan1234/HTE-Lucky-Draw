import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CreateDrawDialogComponent } from 'src/app/draw/create-draw-dialog/create-draw-dialog.component';
import { DeleteDrawDialogComponent } from 'src/app/draw/delete-draw-dialog/delete-draw-dialog.component';
import { Draw } from 'src/app/draw/draw';
import { convertDateToDateString } from 'src/app/utility/date';
import { DrawAction } from '../draw.action';
import { DrawSelector } from '../draw.selector';

@Component({
    selector: 'app-lucky-draw',
    templateUrl: './lucky-draw.component.html',
    styleUrls: ['./lucky-draw.component.scss'],
})
export class LuckyDrawComponent implements OnInit {
    loading$!: Observable<boolean>;
    draws$!: Observable<Draw[] | undefined>;
    error$!: Observable<string | undefined>;

    constructor(
        private router: Router,
        private matDialog: MatDialog,
        private snackBar: MatSnackBar,
        private readonly store: Store
    ) {}

    ngOnInit(): void {
        this.store.dispatch(DrawAction.loadDraws());
        this.loading$ = this.store.select(DrawSelector.selectLoading);
        this.error$ = this.store.select(DrawSelector.selectError);
        this.draws$ = this.store.select(DrawSelector.selectDraws);
    }

    getReadableDate(date: Timestamp): string {
        return convertDateToDateString(date.toDate());
    }

    refresh(): void {
        this.store.dispatch(DrawAction.loadDraws());
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

    stopEvent(event: Event): void {
        event.stopPropagation();
    }

    navigateToDrawMainPage(drawId: string): Promise<boolean> {
        return this.router.navigate([`draws/${drawId}/main`]);
    }

    navigateToParticipantPage(drawId: string): Promise<boolean> {
        return this.router.navigate([`draws/${drawId}/participants`]);
    }

    navigateToPrizePage(drawId: string): Promise<boolean> {
        return this.router.navigate([`draws/${drawId}/prizes`]);
    }

    navigateToSettingPage(drawId: string): Promise<boolean> {
        return this.router.navigate([`draws/${drawId}/settings`]);
    }
}
