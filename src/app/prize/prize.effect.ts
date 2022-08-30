import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class PrizeEffects {
    constructor(private actions$: Actions, private readonly store: Store) {}
}
