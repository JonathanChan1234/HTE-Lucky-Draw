import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ParticipantService } from '../participant.service';

@Component({
    selector: 'app-participant-paginator',
    templateUrl: './participant-paginator.component.html',
    styleUrls: ['./participant-paginator.component.scss'],
})
export class ParticipantPaginatorComponent implements OnInit {
    pageSize = 1;
    constructor(private participantService: ParticipantService) {}

    ngOnInit(): void {}

    pageSizeChange({ value }: MatSelectChange) {
        this.participantService.updatePageSize(value);
    }

    goToNextPage(): void {
        this.participantService.nextPage();
    }

    goToPreviousPage(): void {
        this.participantService.previousPage();
    }
}
