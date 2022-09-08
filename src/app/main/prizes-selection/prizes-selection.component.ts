import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Prize } from 'src/app/prize/prize';
import { DrawMainAction } from '../draw-main.action';
import { DrawMainSelector } from '../draw-main.selector';
import { PrizesSelectionDialogComponent } from '../prizes-selection-dialog/prizes-selection-dialog.component';

@Component({
    selector: 'app-prizes-selection',
    templateUrl: './prizes-selection.component.html',
    styleUrls: ['./prizes-selection.component.scss'],
})
export class PrizesSelectionComponent implements OnInit {
    prizes$!: Observable<Prize[]>;
    numberOfPrizes = 1;

    constructor(private readonly store: Store, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.prizes$ = this.store.select(DrawMainSelector.selectPrizes);
    }

    openSelectionDialog(prizeQuantity: number): void {
        const matDialogRef = this.matDialog.open(
            PrizesSelectionDialogComponent,
            {
                data: {
                    numberOfPrizes: prizeQuantity,
                    defaultValue: this.numberOfPrizes,
                },
            }
        );
        matDialogRef.afterClosed().subscribe((value) => {
            if (!value) return;
            if (typeof value !== 'number') return;
            this.numberOfPrizes = value;
        });
    }

    startDraw(prizes: Prize[]): void {
        this.store.dispatch(
            DrawMainAction.loadWinnerGroups({
                prizes: prizes.slice(0, this.numberOfPrizes - 1),
                numberOfDraws: this.numberOfPrizes,
            })
        );
    }
}
