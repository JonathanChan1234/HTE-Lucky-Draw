import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { PrizeCreateDialogComponent } from '../prize-create-dialog/prize-create-dialog.component';
import { PrizeImportDialogComponent } from '../prize-import-dialog/prize-import-dialog.component';
import { PrizeAction } from '../prize.action';

@Component({
    selector: 'app-prize-toolbar',
    templateUrl: './prize-toolbar.component.html',
    styleUrls: ['./prize-toolbar.component.scss'],
})
export class PrizeToolbarComponent implements OnInit {
    isSmallScreen$!: Observable<boolean>;
    drawId: string | null;

    constructor(
        private matDialog: MatDialog,
        private screenSizeService: ScreenSizeService,
        private route: ActivatedRoute,
        private readonly store: Store
    ) {
        this.drawId = this.route.snapshot.paramMap.get('drawId');
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
    }

    openCreatePrizeDialog(): void {
        if (!this.drawId) return;
        const matDialogRef = this.matDialog.open(PrizeCreateDialogComponent, {
            data: this.drawId,
        });
        matDialogRef.afterClosed().subscribe((value) => {
            if (!value) return;
            const { name, sponsor, sequence } = value;
            if (
                name === undefined ||
                sponsor === undefined ||
                sequence === undefined
            )
                return;
            this.store.dispatch(
                PrizeAction.createPrize({
                    prizes: [{ name, sequence, sponsor }],
                })
            );
        });
    }

    openImportPrizeDialog(): void {
        if (!this.drawId) return;
        const matDialogRef = this.matDialog.open(PrizeImportDialogComponent);
        matDialogRef.afterClosed().subscribe((prizes) => {
            if (!prizes) return;
            this.store.dispatch(PrizeAction.createPrize({ prizes }));
        });
    }
}
