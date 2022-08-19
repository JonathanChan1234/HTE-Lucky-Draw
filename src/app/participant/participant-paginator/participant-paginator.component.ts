import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { ParticipantAction } from '../participant.action';
import { AppState } from '../participant.reducer';

@Component({
    selector: 'app-participant-paginator',
    templateUrl: './participant-paginator.component.html',
    styleUrls: ['./participant-paginator.component.scss'],
})
export class ParticipantPaginatorComponent implements OnInit {
    pageSize = 1;
    constructor(private store: Store<AppState>) {}

    ngOnInit(): void {}

    pageSizeChange({ value }: MatSelectChange) {
        this.store.dispatch(ParticipantAction.setPageSize({ pageSize: value }));
    }

    goToNextPage(): void {
        this.store.dispatch(ParticipantAction.goToNexPage());
    }

    goToPreviousPage(): void {
        this.store.dispatch(ParticipantAction.goToPreviousPage());
    }
}
