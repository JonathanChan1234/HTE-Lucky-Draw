import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-error-message-bar',
    templateUrl: './error-message-bar.component.html',
    styleUrls: ['./error-message-bar.component.scss'],
})
export class ErrorMessageBarComponent implements OnInit {
    @Input()
    errMsg!: string;

    constructor() {}

    ngOnInit(): void {}
}
