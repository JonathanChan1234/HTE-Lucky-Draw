import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    BehaviorSubject,
    catchError,
    map,
    merge,
    Observable,
    of,
    shareReplay,
    switchMap,
    throwError,
} from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { Participant } from '../participant';
import { ParticipantService } from '../participant.service';

@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit {
    isSmallScreen$!: Observable<boolean>;
    refresh$ = new BehaviorSubject<boolean>(true);
    loading$!: Observable<boolean>;
    participants$!: Observable<Participant[] | null>;
    errorMsg = '';

    constructor(
        private screenSizeService: ScreenSizeService,
        private participantService: ParticipantService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
        this.participants$ = this.route.params.pipe(
            switchMap((params) =>
                !!params['drawId']
                    ? this.participantService.getParticipantList(
                          params['drawId']
                      )
                    : throwError(() => new Error('Empty Draw Id'))
            ),
            catchError((err) => {
                this.errorMsg = err.message;
                return of(null);
            }),
            shareReplay(1)
        );
        this.loading$ = merge(
            this.refresh$,
            this.participants$.pipe(
                catchError(() => of(false)),
                map(() => false)
            )
        );
    }
}
