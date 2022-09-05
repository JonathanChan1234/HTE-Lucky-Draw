import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Prize } from '../prize';
import { PrizeDeleteDialogComponent } from '../prize-delete-dialog/prize-delete-dialog.component';
import { PrizeDetailsDialogComponent } from '../prize-details-dialog/prize-details-dialog.component';
import { PrizeEditDialogComponent } from '../prize-edit-dialog/prize-edit-dialog.component';
import { PrizeAction } from '../prize.action';
import { PrizeSelector } from '../prize.selector';

@Component({
    selector: 'app-prize-list',
    templateUrl: './prize-list.component.html',
    styleUrls: ['./prize-list.component.scss'],
})
export class PrizeListComponent implements OnInit {
    drawId!: string | null;
    isSmallScreen$!: Observable<boolean>;
    loading$!: Observable<boolean>;
    prizes$!: Observable<Prize[]>;
    error$!: Observable<string | null>;

    constructor(
        private screenSizeService: ScreenSizeService,
        private readonly store: Store,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.loading$ = this.store.select(PrizeSelector.selectLoading);
        this.prizes$ = this.store.select(PrizeSelector.selectPrizeList);
        this.error$ = this.store.select(PrizeSelector.selectError);
    }

    openDeletePrizeDialog(prize: Prize): void {
        const matDialogRef = this.matDialog.open(PrizeDeleteDialogComponent, {
            data: prize,
        });
        matDialogRef.afterClosed().subscribe((result) => {
            if (!result) return;
            this.store.dispatch(PrizeAction.deletePrize({ prizeId: prize.id }));
        });
    }

    openPrizeDetailsDialog(prize: Prize): void {
        this.matDialog.open(PrizeDetailsDialogComponent, { data: prize });
    }

    openEditPrizeDialog(prize: Prize): void {
        const matDialogRef = this.matDialog.open(PrizeEditDialogComponent, {
            data: prize,
        });
        matDialogRef.afterClosed().subscribe((editPrizeDao) => {
            if (!editPrizeDao) return;
            this.store.dispatch(PrizeAction.editPrize({ prize: editPrizeDao }));
        });
    }
}
