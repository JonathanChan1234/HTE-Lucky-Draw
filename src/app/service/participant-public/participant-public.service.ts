import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Participant } from 'src/app/participant/participant';
import { environment } from 'src/environments/environment';

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
            .post<Participant>(
                `${environment.host}/${userId}/draws/${drawId}/signIn`,
                { participantId }
            )
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('Error at RoomService; Client Side:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            console.error(
                `Error at RoomService; Backend returned code ${error.status}, body was: `,
                error.error.msg
            );
        }
        const errorMsg = error.error.msg;

        return throwError(
            () =>
                new Error(
                    `${Array.isArray(errorMsg) ? errorMsg.join(',') : errorMsg}`
                )
        );
    }
}
