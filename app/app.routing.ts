import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ChatComponent } from './chat/chat.component';

var excludedComponents = [];

let APP_ROUTES: Routes = [
    {
        path: "", component: ChatComponent
    }
];

export const routing = NativeScriptRouterModule.forRoot(APP_ROUTES);
