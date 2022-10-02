import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { ParticipantDbService } from '../participant-db.service';
import {
    ImportedParticipant,
    participantListCsvParser,
} from '../participant-list-csv-parser';

@Component({
    selector: 'app-import-participants-dialog',
    templateUrl: './import-participants-dialog.component.html',
    styleUrls: ['./import-participants-dialog.component.scss'],
})
export class ImportParticipantsDialogComponent implements OnInit {
    errMsg = '';

    fileName = '';
    loadingState = {
        loading: false,
        msg: '',
    };
    participantList: ImportedParticipant[] = [];

    reader: FileReader;

    constructor(
        @Inject(MAT_DIALOG_DATA) public drawId: string,
        private dialogRef: MatDialogRef<ImportParticipantsDialogComponent>,
        private participantDbService: ParticipantDbService
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
            msg: 'Processing Participant List',
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
            this.errMsg = '';
            this.participantList = participantListCsvParser(
                this.reader.result.toString()
            );
        } catch (error) {
            this.errMsg = (error as Error).message;
        }
    }

    importParticipantList() {
        this.loadingState = {
            loading: true,
            msg: 'Importing Participant List',
        };
        from(
            this.participantDbService.createParticipant(
                this.drawId,
                this.participantList
            )
        ).subscribe({
            next: () => {
                this.loadingState = {
                    loading: false,
                    msg: '',
                };
                this.dialogRef.close(true);
            },
            error: (error) => {
                this.loadingState = {
                    loading: false,
                    msg: '',
                };
                this.errMsg = error.message;
            },
        });
    }
}
