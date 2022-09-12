import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-empty-list',
    templateUrl: './empty-list.component.html',
    styleUrls: ['./empty-list.component.scss'],
})
export class EmptyListComponent implements OnInit {
    @Input()
    message!: string;

    @Input()
    btnMessage!: string;

    @Output()
    emptyListActionEmitter: EventEmitter<void> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    emptyListAction(): void {
        this.emptyListActionEmitter.emit();
    }
}
