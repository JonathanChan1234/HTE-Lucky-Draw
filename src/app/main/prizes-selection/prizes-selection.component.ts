import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { Prize } from 'src/app/prize/prize';
import { DrawMainAction } from '../draw-main.action';
import { DrawGroup } from '../draw-main.reducer';
import { DrawMainSelector } from '../draw-main.selector';
import { PrizesSelectionDialogComponent } from '../prizes-selection-dialog/prizes-selection-dialog.component';

@Component({
    selector: 'app-prizes-selection',
    templateUrl: './prizes-selection.component.html',
    styleUrls: ['./prizes-selection.component.scss'],
})
export class PrizesSelectionComponent implements OnInit {
    @Input()
    prizes!: Prize[];

    drawGroups$!: Observable<DrawGroup[]>;
    loadingDrawGroups$!: Observable<boolean>;
    loadDrawGroupsError$!: Observable<string | undefined>;

    isAnimating = false;

    numberOfPrizes = 1;

    constructor(private readonly store: Store, private matDialog: MatDialog) {}

    ngOnInit(): void {
        this.drawGroups$ = this.store
            .select(DrawMainSelector.selectDrawGroups)
            .pipe(filter((groups) => groups.length !== 0));
        this.loadingDrawGroups$ = this.store.select(
            DrawMainSelector.selectLoadingDrawGroups
        );
        this.loadDrawGroupsError$ = this.store.select(
            DrawMainSelector.selectLoadDrawGroupError
        );
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
            DrawMainAction.loadDrawGroups({
                prizes: prizes.slice(0, this.numberOfPrizes),
            })
        );
    }

    disablePrizeSelection(isAnimating: boolean): void {
        this.isAnimating = isAnimating;
    }
}
