import { Component, OnInit } from '@angular/core';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
    CdkDrag,
    CdkDropList,
} from '@angular/cdk/drag-drop';
import { ModalComponent } from './components/modal/modal.component';
import axios from 'axios';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    standalone: true,
    imports: [CdkDropList, CdkDrag, ModalComponent, CommonModule],
    providers: [DatePipe], // Add the DatePipe to the providers array
})
export class CdkDragDropConnectedSortingExample implements OnInit {
    constructor(private datePipe: DatePipe) { }
    todo: any[] = [];
    planned: any[] = [];
    design: any[] = [];
    inDev: any[] = [];
    qa: any[] = [];

    ngOnInit(): void {
        const self = this;
        this.getData(self);
    }
    getData(param: any): void {
        axios.get('http://localhost:5000/api/tickets/getData')
            .then(function (response) {
                const data = response.data.data;
                param.todo = data.filter((obj: any) => obj.status === 1).sort((a: any, b: any) => a.position - b.position);
                param.planned = data.filter((obj: any) => obj.status === 2).sort((a: any, b: any) => a.position - b.position);;
                param.design = data.filter((obj: any) => obj.status === 3).sort((a: any, b: any) => a.position - b.position);;
                param.inDev = data.filter((obj: any) => obj.status === 4).sort((a: any, b: any) => a.position - b.position);;
                param.qa = data.filter((obj: any) => obj.status === 5).sort((a: any, b: any) => a.position - b.position);;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onRerender() {
        const self = this;
        this.getData(self);
    }

    drop(event: CdkDragDrop<any[]>, containerId: any) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
        axios.post('http://localhost:5000/api/tickets/updateTicket', {
            targetId: containerId,
            itemId: event.container.data[event.currentIndex]._id,
            positionIndex: event.currentIndex
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}