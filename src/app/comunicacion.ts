import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { io } from 'socket.io-client';



interface JoinRoomResponse {
    success: boolean;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private socket;
    private sorteoSource = new BehaviorSubject<number | null>(null);
    
    private puntajeSource = new BehaviorSubject<any>(null);
    private categoriesSource = new BehaviorSubject<string[]>([]);
    private overstate = new BehaviorSubject<any>(null);

    private top3 = new BehaviorSubject<string[]>([]);
    sorteo$ = this.sorteoSource.asObservable();
    puntaje$ = this.puntajeSource.asObservable();
    
    top3$ = this.top3.asObservable();
    constructor(private sanitizer: DomSanitizer) {
        this.socket = io('http://localhost:4000');
        this.initializeListeners();
        this.listenForCategories();
    }
    selectedCategories: string[] = [];
    NumPreguntas: number = 0;
    numJugadores: number = 0;
    salaId: number = 0;
    nombre = ""
    


    setCategories(categories: string[]): void {
        this.selectedCategories = categories;
        // console.log('Setting categories:', categories);
        if (this.salaId) {
            this.socket.emit('setCategories', categories);
        } else {
            console.error('Attempted to set categories without a valid salaId');
        }
    }


    // private initializeListeners(): void {
    //     this.socket.on('realizarSorteo', (data) => {
    //         // console.log('Sorteo recibido:', data);
    //         this.sorteoSource.next(data.numero);

    //     });
    // }


    private initializeListeners(): void {
        this.socket.on('realizarSorteo', (data) => {
            const salaStr = data.sala.toString();
            const salabc = this.salaId.toString();
            if (data && data.numero !== undefined && salaStr === salabc) {
                this.sorteoSource.next(data.numero);
            } else {
                console.error('Error: Datos del sorteo no recibidos correctamente.');
            }
        });

        this.socket.on('answerResult', (data) => {
            let resulta = [data.score, data.isCorrect]
            this.puntajeSource.next(resulta);

        });

        this.socket.on('top3', (data) => {
            const salaStr = data.roomId.toString();
            const salasStr = this.salaId.toString();
            console.log(salaStr== salasStr, "data", salaStr, "salaId", salasStr)
            if(salasStr == salaStr){
                this.top3.next(data.top3);
                
            }
            
            
        });

        this.socket.on('ConCupo', (data) => {
            
        });

        this.socket.on('GameOver', (data) => {
            if (data == this.salaId){
                console.log("se supone que escucha")
                this.overstate.next(data)
            }
            
            
        });
    }
    setNombre(nombre: string): void {
        this.socket.emit('setNombre', nombre);
        this.nombre = nombre
    }
    getOverState(){
        return this.overstate.asObservable()
    }

    getNombre(){
        return this.nombre
    }


    setNumPreguntas(num: number): void {
        this.NumPreguntas = num;
    }



    setNumJugadores(num: number): void {
        this.numJugadores = num;
    }

    private listenForCategories(): void {
        this.socket.on('categories', (categories: string[]) => {
            if (categories) {
                this.categoriesSource.next(categories);
            } else {
                console.error('Received undefined categories from server');
            }
        });

    }

    reset() {
        this.socket.emit('resetSorteo', this.salaId)
    }

    getCategoriest(): string[] {
        this.socket.emit('requestCategories')
        this.socket.on('categories', (data) => {
            // // console.log('Categories received:', data);
            this.selectedCategories = data;
        })
        // // console.log(this.selectedCategories, "getCategories")
        return this.selectedCategories;

    }

    getCategories(): Observable<string[]> {
        this.socket.emit('requestCategories');
        return this.categoriesSource.asObservable();
    }

    getNumPreguntas(): number {
        return this.NumPreguntas;
    }

    getNumJugadores(): number {
        return this.numJugadores;
    }

    setSalaId(id: number): void {
        this.salaId = id;
    }

    getSalaId(): number {
        return this.salaId;
    }

 

    getOcupacion(): Observable<number> {
        return new Observable(subscriber => {
            this.socket.emit('ocupacion', this.salaId);
            this.socket.on('ocupancy', data => {
                subscriber.next(data);
                subscriber.complete();
                console.log("Datos de ocupación recibidos:", data);
            });
        });
    }
    setSalaBack() {
        this.socket.emit('joinRoom', [this.nombre ,this.salaId, this.NumPreguntas, this.numJugadores ]);
    }

    // setSalaBack() {
    //     this.socket.emit('joinRoom', { roomId: this.salaId }, (response: JoinRoomResponse) => {
    //         if (response.success) {
    //             // console.log('Unido a la sala con éxito');
    //             this.escucharSorteo(); // Iniciar escucha del sorteo aquí asegura que el listener está activo.
    //         } else {
    //             console.error('Error al unirse a la sala:', response.message);
    //         }
    //     });
    // }

    iniciarSorteo() {
        // // console.log("Iniciando sorteo");
        this.socket.emit('iniciarSorteo', { roomId: this.salaId });
    }

    escucharSorteo() {
        this.socket.on('realizarSorteo', (data) => {
            // console.log("si llega el sorte");
            this.sorteoSource.next(data.ganador);
        });
    }

    escucharPuntaje() {
        this.socket.on('answerResult', (data) => {
            // console.log('Respuesta correcta:', data.isCorrect);
            if (data.isCorrect) {
                this.puntajeSource.next(data.score);
            }
        });
    }

    // escucharSorteo() {
    //     this.socket.on('realizarSorteo', (data) => {
    //         // console.log("Sorteo recibido:", data);
    //         if (data.numero !== undefined) {
    //             this.sorteoSource.next(data.numero);
    //         } else {
    //             console.error('Datos del sorteo no recibidos correctamente');
    //         }
    //     });
    // }

    validarRespuesta(opcionseleccionada: any,): boolean {
        this.socket.emit('answer', { roomId: this.salaId, answer: opcionseleccionada });
        let isCorrect = false;
        this.socket.on('answerResult', (data) => {
            // console.log(data, "data");
            if (data.isCorrect) {
                isCorrect = true;
            } else {
                isCorrect = false;
            }
        });
        return isCorrect;
    }

    seleccionPregunta(categoria: string): Observable<{ pregunta: string, respuestas: string[] }> {
        this.socket.emit('requestQuestions', categoria);
        return new Observable(observer => {
            this.socket.on('newQuestion', (data) => {
                observer.next(data);
                observer.complete();
            });


        });
    }


    connectToGame() {

        this.socket.emit('iniciarSorteo', { roomId: this.salaId });



    }





}

