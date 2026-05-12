import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';

@Injectable({
    providedIn: 'root'
})
export class AppLayoutService extends AppLayoutBaseService {

    override customizeMenuContent(menu: any) {
        menu?.left?.forEach((ele: any) => {
            // if(ele.label === 'Menu'){
            //     menu.left[0].label = "menu ReNamed";
            // }
        })
        return menu;
    }
}