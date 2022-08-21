import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ScreenSizeService } from 'src/app/service/screen-size/screen-size.service';
import { ParticipantAction } from '../participant.action';
import { selectPageOption } from '../participant.selector';

@Component({
    selector: 'app-draw-participants',
    templateUrl: './draw-participants.component.html',
    styleUrls: ['./draw-participants.component.scss'],
})
export class DrawParticipantsComponent implements OnInit, OnDestroy {
    isSmallScreen$!: Observable<boolean>;
    participantSubscription!: Subscription;

    constructor(
        private screenSizeService: ScreenSizeService,
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.participantSubscription = combineLatest([
            this.route.params,
            this.store.select(selectPageOption),
        ]).subscribe(([params]) => {
            if (!params['drawId']) return;
            this.store.dispatch(
                ParticipantAction.loadParticipant({ drawId: params['drawId'] })
            );
        });
        this.isSmallScreen$ = this.screenSizeService.isSmallScreen();
    }

    ngOnDestroy(): void {
        if (!this.participantSubscription) return;
        this.participantSubscription.unsubscribe();
    }
}
