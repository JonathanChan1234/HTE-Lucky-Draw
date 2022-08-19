import { Injectable, OnDestroy } from '@angular/core';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    from,
    map,
    Observable,
    switchMap,
    tap,
} from 'rxjs';
import { Participant } from './participant';
import { ParticipantDbService } from './participant-db.service';

export type ParticipantSearchFilter = {
    searchField: 'name' | 'id';
    searchValue: string;
    signedIn?: boolean; // undefined if don't care
    prizeWinner?: boolean; // undefined if don't care
};

export type ParticipantPaginatorOption = {
    id: string;
    type: 'startAfter' | 'endBefore';
};

@Injectable({
    providedIn: 'root',
})
export class ParticipantService implements OnDestroy {
    private participants: Participant[] = [];
    private lastId: string = '';
    private firstId: string = '';

    private readonly filter$ = new BehaviorSubject<ParticipantSearchFilter>({
        searchField: 'id',
        searchValue: '',
        signedIn: undefined,
        prizeWinner: undefined,
    });
    private readonly pageSize$ = new BehaviorSubject<number>(1);
    private readonly page$ = new BehaviorSubject<
        ParticipantPaginatorOption | undefined
    >(undefined);

    constructor(private participantDb: ParticipantDbService) {}

    getParticipantList(drawId: string): Observable<Participant[]> {
        this.firstId = '';
        this.lastId = '';
        this.participants = [];
        return combineLatest([
            this.filter$,
            this.pageSize$,
            this.page$.pipe(
                distinctUntilChanged(
                    (prev, curr) =>
                        !!prev &&
                        !!curr &&
                        prev.type === curr.type &&
                        prev.id === curr.id
                    // ignore if prev and curr are the same action and the cursor id does not change
                )
            ),
        ]).pipe(
            switchMap(([filter, pageSize, page]) =>
                from(
                    this.participantDb.getParticipants(
                        drawId,
                        pageSize,
                        filter,
                        page
                    )
                )
            ),
            map((participants) =>
                participants.length === 0 ? this.participants : participants
            ),
            tap((participants) => {
                if (!participants) return;
                if (participants.length === 0) return;
                this.participants = participants;
                this.firstId = participants[0].id;
                this.lastId = participants[participants.length - 1].id;
            })
        );
    }

    updatePageSize(pageSize: number): void {
        this.pageSize$.next(pageSize);
    }

    nextPage(): void {
        if (!this.lastId) return;
        this.page$.next({ type: 'startAfter', id: this.lastId });
    }

    previousPage(): void {
        if (!this.firstId) return;
        this.page$.next({ type: 'endBefore', id: this.firstId });
    }

    updateSearchFilter(filter: ParticipantSearchFilter): void {
        this.filter$.next(filter);
    }

    ngOnDestroy(): void {
        this.filter$.complete();
        this.pageSize$.complete();
    }
}
