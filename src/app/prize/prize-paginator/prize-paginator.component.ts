import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PrizeAction } from '../prize.action';
import { PrizeSelector } from '../prize.selector';

@Component({
    selector: 'app-prize-paginator',
    templateUrl: './prize-paginator.component.html',
    styleUrls: ['./prize-paginator.component.scss'],
})
export class PrizePaginatorComponent implements OnInit {
    pageSize = 1;
    reachStart$!: Observable<boolean>;
    reachEnd$!: Observable<boolean>;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.reachStart$ = this.store.select(PrizeSelector.selectReachStart);
        this.reachEnd$ = this.store.select(PrizeSelector.selectReachEnd);
    }

    pageSizeChange({ value: pageSize }: MatSelectChange) {
        this.store.dispatch(PrizeAction.setPageSize({ pageSize }));
    }

    goToPreviousPage() {
        this.store.dispatch(PrizeAction.goToPreviousPage());
    }

    goToNextPage() {
        this.store.dispatch(PrizeAction.goToNextPage());
    }
}
