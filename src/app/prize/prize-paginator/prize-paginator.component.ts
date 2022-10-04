import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PrizeAction } from '../prize.action';
import { PrizeSelector } from '../prize.selector';

@Component({
    selector: 'app-prize-paginator',
    templateUrl: './prize-paginator.component.html',
    styleUrls: ['./prize-paginator.component.scss'],
})
export class PrizePaginatorComponent implements OnInit {
    pageSize = environment.production ? 10 : 1;
    reachStart$!: Observable<boolean>;
    reachEnd$!: Observable<boolean>;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.reachStart$ = this.store.select(PrizeSelector.selectReachStart);
        this.reachEnd$ = this.store.select(PrizeSelector.selectReachEnd);
        this.store
            .select(PrizeSelector.selectPageSize)
            .pipe(first())
            .subscribe((pageSize) => {
                this.pageSize = pageSize;
            });
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
