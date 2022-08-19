import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Participant } from '../participant';
import { AppState } from '../participant.reducer';
import { selectParticipant } from '../participant.selector';

@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit {
    isSmallScreen$!: Observable<boolean>;
    refresh$ = new BehaviorSubject<boolean>(true);
    loading$!: Observable<boolean>;
    participants$!: Observable<Participant[]>;
    errorMsg = '';

    constructor(
        private screenSizeService: ScreenSizeService,
        private store: Store<AppState>
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.participants$ = this.store.select(selectParticipant);
    }
}
