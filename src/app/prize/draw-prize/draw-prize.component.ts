import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PrizeAction } from '../prize.action';
import { PrizeSelector } from '../prize.selector';

@Component({
    selector: 'app-draw-prize',
    templateUrl: './draw-prize.component.html',
    styleUrls: ['./draw-prize.component.scss'],
})
export class DrawPrizeComponent implements OnInit {
    handlingRequest!: Observable<boolean>;
    snackBarSubscription!: Subscription;

    constructor(
        private route: ActivatedRoute,
        private readonly store: Store,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.handlingRequest = this.store.select(
            PrizeSelector.selectHandlingRequest
        );
        this.route.params.subscribe((params) => {
            const drawId = params['drawId'];
            if (!drawId) {
                this.store.dispatch(
                    PrizeAction.loadPrizeError({ error: 'Empty Draw Id' })
                );
                return;
            }
            this.store.dispatch(PrizeAction.loadPrizes());
        });
    }
}
