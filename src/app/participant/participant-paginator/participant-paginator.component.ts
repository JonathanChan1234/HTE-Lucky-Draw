import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParticipantAction } from '../participant.action';
import { ParticipantSelector } from '../participant.selector';

@Component({
    selector: 'app-participant-paginator',
    templateUrl: './participant-paginator.component.html',
    styleUrls: ['./participant-paginator.component.scss'],
})
export class ParticipantPaginatorComponent implements OnInit {
    pageSize = environment.production ? 10 : 1;
    reachStart$!: Observable<boolean>;
    reachEnd$!: Observable<boolean>;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.reachStart$ = this.store.select(
            ParticipantSelector.selectReachStart
        );
        this.reachEnd$ = this.store.select(ParticipantSelector.selectReachEnd);
        this.store
            .select(ParticipantSelector.selectPageSize)
            .pipe(first())
            .subscribe((pageSize) => (this.pageSize = pageSize));
    }

    pageSizeChange({ value }: MatSelectChange) {
        this.store.dispatch(ParticipantAction.setPageSize({ pageSize: value }));
    }

    goToNextPage(): void {
        this.store.dispatch(ParticipantAction.goToNextPage());
    }

    goToPreviousPage(): void {
        this.store.dispatch(ParticipantAction.goToPreviousPage());
    }
}
