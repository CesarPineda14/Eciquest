import { Component, ViewChild, ElementRef, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

import { DataService } from '../comunicacion';
import { MatDialog } from '@angular/material/dialog';
import { GameOverDialogComponent } from '../game-over-dialog/game-over-dialog.component';
interface Players3 {
  playerId: string;
  score: number;
}

@Component({
  selector: 'app-sala',
  templateUrl: './sala.component.html',
  styleUrls: ['./sala.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SalaComponent implements OnInit, AfterViewInit {
  @ViewChild('ruleta') ruletaElementRef!: ElementRef;
  
  private spinSound = new Audio('/assets/audio/RULETA.mp3');
  private stopSound = new Audio('/assets/audio/stopWheel.mp3');
  private clock = new Audio('/assets/audio/temporizador.mp3');
  private clockend = new Audio('/assets/audio/temporizadorFin.mp3');
  constructor(private sanitizer: DomSanitizer, private data: DataService, public dialog: MatDialog)
              { }
  root = document.documentElement
  animacionCarga:any
  sortenado = false
  countdown: number | null = null;
  countdownSubscription: any;
  preguntaGlobal:any = ""
  opcionRespuesta:any = []
  selectedOption: number | null = null;
  areLabelsDisabled: boolean = false;
  botonActivo = true
  showformat = false
  repuestaEsperada=""
  opcionseleccionada = ""
  idSala = 0
  puntaje:any = 0
  usuarioDb = "prueba"
  passwordDb = "prueba"
  puedeIniciar = false
  top3:any = []
  userName=""
  

  colorList = [
    "#126253", // a dark shade of blue
    "#FF0000", // red
    "#00FF00", // lime green
    "#0000FF", // blue
    "#FFFF00", // yellow
    "#00FFFF", // cyan
    "#FF00FF", // magenta
    "#C0C0C0", // silver
    "#808080", // gray
    "#800000", // maroon
    "#808000", // olive
  ];
  conceptos:any[] = []
  private subscription = new Subscription();
  // conceptos = ["bases de datos", "logica"]

  ngOnInit() {
    this.userName = this.data.getNombre()
    this.conceptos = this.data.getCategoriest();
    console.log(this.conceptos, "conceptos")
    this.ajustarRuleta();
    this.idSala = this.data.getSalaId();
    this.data.setSalaBack();

    this.subscription.add(this.data.sorteo$.subscribe(data => {
      console.log("Sorteo recibido:", data);
      
        if (data !== null && data !== undefined ) {
            console.log("Sorteo recibido:", data);
            
            this.sorteo(data);
            
        }
        
    }));


    this.subscription.add(this.data.top3$.subscribe(data => {
      this.top3 = data;
      
     
        
    }));

    


    this.subscription.add(this.data.puntaje$.subscribe(data => {
      
      this.puntaje = data[0];
   
      const selectedLabel = document.querySelector(`.opcionsel.selected`);
    
      if (data[1]) {
        if (selectedLabel) {
          selectedLabel.classList.add('correct-answer');
        }
      } else {
        if (selectedLabel) {
          selectedLabel.classList.add('incorrect-answer');
        }
      }

      this.data.getOverState().subscribe((overState) => {
        console.log("Datos de overstate recibidos:", overState);
        if(overState){
          this.openGameOverDialog();
        }
        
    });
    
      setTimeout(() => {
        if (selectedLabel) {
          selectedLabel.classList.remove('correct-answer');
          selectedLabel.classList.remove('incorrect-answer');
        }
      }, 3000); // 3000 ms = 3 segundos
    }));
}


openGameOverDialog(): void {
  this.dialog.open(GameOverDialogComponent, {
    width: '400px',
    height: '200px',
    position: { top: '30px' }
  });
}

  validarRespuesta(){
    // if (this.opcionseleccionada == this.repuestaEsperada){
    //   alert("!Respuesta correcta¡")
    // }else{
    //   console.log("!perdiste¡")
    //   alert("!Respuesta incorrecta¡")
    // }
    // this.socket.off('answerResult');
    // this.socket.emit('answer', {roomId: this.idSala, answer:this.opcionseleccionada});
    // this.socket.on('answerResult', (data) => {
    //   if (data.isCorrect){
    //     console.log("!Respuesta correcta¡")
    //     this.puntaje += 10;
    //     console.log(this.puntaje);

    //   }
    //   else{
    //     console.log("!perdiste¡")
    //   }
    //   this.puntaje = data.score

    //       });

    let respuesta= this.data.validarRespuesta(this.opcionseleccionada)
    console.log(respuesta, "respuesta")
    if(respuesta){
      this.puntaje += 10;


    }
    else{ 
      console.log("!perdiste¡")
    }
    


  }

  selectOption(index: number): void {
    this.selectedOption = index;
    console.log(this.opcionRespuesta[index])
    this.opcionseleccionada = this.opcionRespuesta[index]
    this.areLabelsDisabled = true
  }

  preguntasSeleccion(categoria: string) {
    this.data.seleccionPregunta(categoria).subscribe({
        next: (data) => {
            this.preguntaGlobal = data.pregunta;
            this.opcionRespuesta = data.respuestas;
            console.log('Pregunta recibida:', this.preguntaGlobal);
            console.log('Respuestas recibidas:', this.opcionRespuesta);
        },
        error: (err) => console.error('Error al recibir la pregunta:', err)
    });
}
  lastRotation: number = 0; 


  ngAfterViewInit() {
    console.log("AfterViewInit")
    this.ruletaElementRef.nativeElement.addEventListener('animationend', () => {
      // Actualiza lastRotation al finalizar la animación
      this.lastRotation = this.getCurrentRotation(this.ruletaElementRef.nativeElement);
      
      console.log(`Animation ended at rotation: ${this.lastRotation}`);
      // 
      
      this.finishSpinSetup();
    });
  }

  finishSpinSetup() {
    const ganadorTexto = document.getElementById("ganadorTexto");
    const winningSegment = this.calculateWinningSegment(this.lastRotation);
    if (ganadorTexto) {
      ganadorTexto.textContent = this.conceptos[winningSegment];
    }
    clearInterval(this.animacionCarga);
    this.spinSound.pause();
    this.spinSound.currentTime = 0;
    this.stopSound.play();
    this.botonActivo = true;
    this.preguntasSeleccion(this.conceptos[winningSegment]);
    this.startCountdown();
    this.areLabelsDisabled = false;
    this.showformat = true;
    
  }

  startCountdown() {
    this.countdown = 10
    const timer$ = interval(1000).pipe(take(10))
    this.countdownSubscription = timer$.subscribe(() => {
      this.clock.play()
      if (this.countdown){this.countdown  -= 1}
      if (this.countdown === 0) {
        this.stopCountdown();
        console.log("final")
        this.areLabelsDisabled = true
        this.clock.pause()
        this.clock.currentTime = 0
        this.clockend.play()
        this.clockend.currentTime = 0
        this.botonActivo = true
        this.validarRespuesta()
      }
    });
  }

  stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe(); // Stop the countdown
    }
    this.ruletaElementRef.nativeElement.classList.remove("girar");
  }
  calculateWinningSegment(rotation: number) {
    let degreesPerSegment = 360 / this.conceptos.length;

    let index = Math.floor(((360 - rotation) % 360) / degreesPerSegment);
    return index;
  }

  ajustarRuleta() {
    let probabilidadAcumulada = 0
    let ruleta = document.getElementById("ruleta")
    const opcionesContainer = document.createElement("div")
    opcionesContainer.id = "opcionesContainer"
    ruleta?.appendChild(opcionesContainer)
    for (let x = 0; x < this.conceptos.length; x++) {
      let opcionElement = document.createElement("div")
      opcionElement.classList.add("opcion")
      opcionesContainer.appendChild(opcionElement)

      const clipPathStyle = this.getPosicionProbabilidad(100 / this.conceptos.length)
      // opcionElement.style.backgroundColor = this.colorList[x]
      // opcionElement.style.clipPath = clipPathStyle;
      // console.log(this.probabilidadAGrados(probabilidadAcumulada))
      opcionElement.setAttribute('style', `background-color: ${this.colorList[x]};transform:rotate(${this.probabilidadAGrados(probabilidadAcumulada)}deg);  ${clipPathStyle}`);
      probabilidadAcumulada += 100 / this.conceptos.length



    }

  }


  getPosicionProbabilidad(probabilidad: number) {
    let clipPathStyle = '';
    if (probabilidad === 100) {
      clipPathStyle = '';
    }
    else if (probabilidad >= 87.5) {
      const x5 = Math.tan(this.probabilidadARadianes(probabilidad)) * 50 + 50;
      // console.log("fffffe  " +x5)
      clipPathStyle = `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${x5}% 0%, 50% 50%)`
    }
    else if (probabilidad >= 75) {
      const y5 = 100 - (Math.tan(this.probabilidadARadianes(probabilidad - 75)) * 50 + 50);
      clipPathStyle = `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
    }
    else if (probabilidad >= 62.5) {
      const y5 = 100 - (0.5 - (0.5 / Math.tan(this.probabilidadARadianes(probabilidad)))) * 100;
      clipPathStyle = `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
    }
    else if (probabilidad >= 50) {

      const x4 = 100 - (Math.tan(this.probabilidadARadianes(probabilidad)) * 50 + 50);
      // console.log(x4)
      clipPathStyle = `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
    }
    else if (probabilidad >= 37.5) {
      // console.log("entra")
      const x4 = 100 - (Math.tan(this.probabilidadARadianes(probabilidad)) * 50 + 50);
      clipPathStyle = `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
    }
    else if (probabilidad >= 25) {
      const y3 = Math.tan(this.probabilidadARadianes(probabilidad - 25)) * 50 + 50;
      clipPathStyle = `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
    }
    else if (probabilidad >= 12.5) {
      const y3 = (0.5 - (0.5 / Math.tan(this.probabilidadARadianes(probabilidad)))) * 100;
      clipPathStyle = `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
    }
    else if (probabilidad >= 0) {
      const x2 = Math.tan(this.probabilidadARadianes(probabilidad)) * 50 + 50;
      clipPathStyle = `clip-path: polygon(50% 0, ${x2}% 0, 50% 50%)`
    }
    return clipPathStyle
  }

  probabilidadARadianes(probabilidad: number) {
    return probabilidad / 100 * 2 * Math.PI;
  }
  probabilidadAGrados(probabilidad: number) {
    return probabilidad * 360 / 100;
  }

  sorteo(ganador: any) {
    
    this.spinSound.play();
    this.selectedOption = -1;
    this.showformat = false;
    this.botonActivo = false;
    // if (this.sortenado) { return; }

    this.sortenado = true;

    let ganadorTexto = document.getElementById("ganadorTexto");
    if (ganadorTexto) {
        ganadorTexto.textContent = ".";
    }
    console.log("Ganador: ", ganador);
    let duracionGiro = 10 * 360 + (1 - ganador) * 360;  
    this.root.style.setProperty("--giroRuleta", `${duracionGiro}deg`);

    let ruleta = this.ruletaElementRef.nativeElement;
    ruleta.classList.add("girar");

    this.animacionCarga = setInterval(() => {
      if (ganadorTexto?.textContent) {
        ganadorTexto.textContent = ganadorTexto.textContent.length < 3 ? ganadorTexto.textContent + "." : ".";
      }
    }, 500);
}


  getCurrentRotation(el: any) {
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform") ||
      st.getPropertyValue("-moz-transform") ||
      st.getPropertyValue("-ms-transform") ||
      st.getPropertyValue("-o-transform") ||
      st.getPropertyValue("transform") ||
      "none";
    if (tm != "none") {
      var values = tm.split('(')[1].split(')')[0].split(',');
      var a = parseFloat(values[0]); // Convert string to float
      var b = parseFloat(values[1]); // Convert string to float
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      return (angle < 0 ? angle + 360 : angle);
    }
    return 0;
  }

//   ngOnDestroy() {
//     this.subscription.unsubscribe();
// }


  connectToGame() {
    this.data.connectToGame()
    this.data.reset()


  }

  ingresarSala(){
    
    this.data.setSalaBack()
  }




}
