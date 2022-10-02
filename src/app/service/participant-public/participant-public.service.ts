import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Participant } from 'src/app/participant/participant';
import { httpHandleErrorFactory } from 'src/app/utility/http';

@Injectable({
    providedIn: 'root',
})
export class ParticipantPublicService {
    constructor(private httpClient: HttpClient) {}

    signIn(
        userId: string,
        drawId: string,
        participantId: string
    ): Observable<Participant> {
        return this.httpClient
            .post<Participant>(`${userId}/draw/${drawId}/signIn`, {
                participantId,
            })
            .pipe(catchError(httpHandleErrorFactory));
    }
}
