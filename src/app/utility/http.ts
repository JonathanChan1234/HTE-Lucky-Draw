import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function httpHandleErrorFactory(error: HttpErrorResponse) {
    if (error.status === 403)
        return throwError(() => new Error('Unauthenticated'));
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
