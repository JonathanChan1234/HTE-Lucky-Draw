import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class PrizeService {
    constructor(private db: Firestore, private authService: AuthService) {}
}
