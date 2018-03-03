import { NativeScriptModule } from "nativescript-angular/nativescript.module";

// >> using-global-directives

import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";

// Not required imports, these are used by the nativescript-samples-angular SDK examples - https://github.com/telerik/nativescript-ui-samples-angular
import { NativeScriptRouterModule, NSModuleFactoryLoader } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { TNSFrescoModule } from "nativescript-fresco/angular";
import { ChatComponent } from './chat/chat.component';
import { SocketService } from './chat/shared/services/socket.service';

// >> (hide)
import * as applicationModule from "tns-core-modules/application";
import * as frescoModule from "nativescript-fresco";

if (applicationModule.android) {
    applicationModule.on("launch", () => {
        frescoModule.initialize();
    });
}
// << (hide)

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        ChatComponent
    ],
    imports: [
        NativeScriptModule,
        CommonModule,
        TNSFrescoModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        routing
    ],
    exports: [
        NativeScriptModule,
        NativeScriptRouterModule
    ],
    providers: [
        SocketService,
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule {
}
