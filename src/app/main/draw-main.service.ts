import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawMainService {
    private readonly refresh$ = new Subject<boolean>();

    constructor() {}

    startDraw(): void {
        this.refresh$.next(true);
    }

    getRefresh(): Subject<boolean> {
        return this.refresh$;
    }
}
