import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class NotifiactionService {


    public msgs: any = [];
    public showMessage(config: any) {
        this.msgs = []
        this.msgs.push(config);
        //To clear the message
        setTimeout(() => {
            this.msgs = [];
        }, 5000);
    }


}
