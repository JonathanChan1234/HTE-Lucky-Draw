import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ParticipantAction } from '../participant.action';
import { selectReachEnd, selectReachStart } from '../participant.selector';

@Component({
    selector: 'app-participant-paginator',
    templateUrl: './participant-paginator.component.html',
    styleUrls: ['./participant-paginator.component.scss'],
})
export class ParticipantPaginatorComponent implements OnInit {
    pageSize = 1;
    reachStart$!: Observable<boolean>;
    reachEnd$!: Observable<boolean>;

    constructor(private readonly store: Store) {}

    ngOnInit(): void {
        this.reachStart$ = this.store.select(selectReachStart);
        this.reachEnd$ = this.store.select(selectReachEnd);
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
