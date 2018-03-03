import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { ObservableArray } from "tns-core-modules/data/observable-array";


const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
    selector: 'tk-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
    action = Action;
    user: User;
    messages = new ObservableArray<Message>([]);
    messageContent: string;
    ioConnection: any;
    defaultDialogUserParams: any = {
        disableClose: true,
        data: {
            title: 'Welcome',
            dialogType: 'NEW'
        }
    };

    ngOnInit(): void {
        this.initModel();
    }


    ngAfterViewInit(): void {
    }

    private initModel(): void {
        const randomId = this.getRandomId();
        this.user = {
            id: randomId,
            avatar: `${AVATAR_URL}/${randomId}.png`
        };
        setTimeout(() => {
            this.openUserPopup(this.defaultDialogUserParams);
        }, 0);
    }

    constructor(private socketService: SocketService) {
    }

    private initIoConnection(): void {
        this.socketService.initSocket();

        this.ioConnection = this.socketService.onMessage()
            .subscribe((message: Message) => {
                this.messages.push(message);
            });


        this.socketService.onEvent(Event.CONNECT)
            .subscribe(() => {
                console.log('connected');
            });

        this.socketService.onEvent(Event.DISCONNECT)
            .subscribe(() => {
                console.log('disconnected');
            });
    }

    private getRandomId(): number {
        return Math.floor(Math.random() * (1000000)) + 1;
    }

    public sendMessage(message: string): void {
        if (!message) {
            return;
        }

        this.socketService.send({
            from: this.user,
            content: message
        });
        this.messageContent = null;
    }

    private openUserPopup(params): void {
        this.user.name = "U"+this.getRandomId();
        this.initIoConnection();
        /*this.dialogRef = this.dialog.open(DialogUserComponent, params);
        this.dialogRef.afterClosed().subscribe(paramsDialog => {
            if (!paramsDialog) {
                return;
            }

            this.user.name = paramsDialog.username;
            if (paramsDialog.dialogType === DialogUserType.NEW) {
                this.initIoConnection();
                this.sendNotification(paramsDialog, Action.JOINED);
            } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
                this.sendNotification(paramsDialog, Action.RENAME);
            }
        });*/
    }

    public sendNotification(params: any, action: Action): void {
        let message: Message;

        if (action === Action.JOINED) {
            message = {
                from: this.user,
                action: action
            }
        } else if (action === Action.RENAME) {
            message = {
                action: action,
                content: {
                    username: this.user.name,
                    previousUsername: params.previousUsername
                }
            };
        }
        this.socketService.send(message);
    }
}
