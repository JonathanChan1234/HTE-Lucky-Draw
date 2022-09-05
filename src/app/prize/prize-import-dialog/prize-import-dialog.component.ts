import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { prizeListCsvParser } from '../prize-list-csv-parser';
import { CreatePrizeDao } from '../prize.action';

@Component({
    selector: 'app-prize-import-dialog',
    templateUrl: './prize-import-dialog.component.html',
    styleUrls: ['./prize-import-dialog.component.scss'],
})
export class PrizeImportDialogComponent implements OnInit {
    fileName = '';
    errMsg = '';
    loadingState = {
        loading: false,
        msg: '',
    };
    reader: FileReader;

    prizeList: CreatePrizeDao[] = [];

    constructor(
        private matDialogRef: MatDialogRef<PrizeImportDialogComponent>
    ) {
        this.reader = new FileReader();
        this.reader.onload = this.onDataReady.bind(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ngOnInit(): void {}

    clearPreviousFile(event: Event) {
        (event.target as HTMLInputElement).value = '';
    }

    onFileUpload(event: Event) {
        this.loadingState = {
            loading: true,
            msg: 'Processing Prize List File',
        };
        const files = (event.target as HTMLInputElement).files;
        if (files === null || files.length === 0 || files.item(0) === null)
            return;
        this.fileName = files[0]?.name ?? '';
        this.reader.readAsText(files[0]);
    }

    onDataReady() {
        this.loadingState = {
            loading: false,
            msg: '',
        };
        if (!this.reader.result) return;
        try {
            this.prizeList = prizeListCsvParser(this.reader.result.toString());
        } catch (error) {
            this.errMsg = (error as Error).message;
        }
    }

    importPrizeList() {
        if (this.prizeList.length === 0) this.matDialogRef.close();
        this.matDialogRef.close(this.prizeList);
    }
}
