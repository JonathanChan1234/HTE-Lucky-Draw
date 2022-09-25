import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { Draw } from '../draw';
import { DrawSelector } from '../draw.selector';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit {
    userId?: string;
    draw!: Observable<Draw | undefined>;

    constructor(
        private readonly store: Store,
        private authService: AuthService,
        private snackBar: MatSnackBar
    ) {
        this.userId = this.authService.getUserId();
    }

    ngOnInit(): void {
        this.draw = this.store.select(DrawSelector.selectCurrentDraw);
    }

    getSignInURL(userId: string, drawId: string): string {
        const host = environment.production
            ? 'https://hte-lucky-draw.web.app'
            : 'http://localhost:4200';
        return `${host}/${userId}/draw/${drawId}/participant/signIn`;
    }

    copySignInURL(uid: string, drawId: string) {
        navigator.clipboard.writeText(this.getSignInURL(uid, drawId));
        this.snackBar.open('Sign In URL copied', 'close', { duration: 2000 });
    }

    private convertBase64ToBlob(Base64Image: string): Blob {
        // split into two parts
        const parts = Base64Image.split(';base64,');
        // hold the content type
        const imageType = parts[0].split(':')[1];
        // decode base64 string
        const decodedData = window.atob(parts[1]);
        // create unit8array of size same as row data length
        const uInt8Array = new Uint8Array(decodedData.length);
        // insert all character code into uint8array
        for (let i = 0; i < decodedData.length; ++i) {
            uInt8Array[i] = decodedData.charCodeAt(i);
        }
        // return blob image after conversion
        return new Blob([uInt8Array], { type: imageType });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveAsImage(parent: any): void {
        let parentElement = null;
        // fetches base 64 data from canvas
        parentElement = parent.qrcElement.nativeElement
            .querySelector('canvas')
            .toDataURL('image/png');
        if (!parentElement) return;

        // converts base 64 encoded image to blobData
        const blobData = this.convertBase64ToBlob(parentElement);
        // saves as image
        const blob = new Blob([blobData], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // name of the file
        link.download = 'Qrcode';
        link.click();
    }
}
