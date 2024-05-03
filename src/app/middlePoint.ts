import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SalaComponent } from './sala/sala.component';




interface JoinRoomResponse {
    success: boolean;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class MiddlePoint {
    constructor(private sala: SalaComponent ) {}
    setSorteo(data:any){

        this.sala.sorteo(data);
        console.log('Sorteo recibido middle:', data);
    }

}