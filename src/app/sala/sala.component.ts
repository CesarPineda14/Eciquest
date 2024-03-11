import { Component, ViewChild, ElementRef, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { preguntasDic } from './preguntas';
import { take } from 'rxjs/operators';
import { interval } from 'rxjs';

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
  constructor(private sanitizer: DomSanitizer) { }
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
  // conceptos = ["bases de datos", "logica", "sistemas"]
  conceptos = ["bases de datos", "logica"]

  ngOnInit() {
    this.ajustarRuleta();

  }

  validarRespuesta(){
    if (this.opcionseleccionada == this.repuestaEsperada){
      console.log("!ganaste¡")
      alert("!Respuesta correcta¡")
    }else{
      console.log("!perdiste¡")
      alert("!Respuesta incorrecta¡")
    }

  }

  selectOption(index: number): void {
    this.selectedOption = index;
    console.log(this.opcionRespuesta[index])
    this.opcionseleccionada = this.opcionRespuesta[index]
    this.areLabelsDisabled = true
  }

  preguntasSeleccion(categoria:string){
    let preguntaDiccionario = preguntasDic.filter(porta => porta.categoria == categoria)
    // this.preguntaGlobal = preguntaDiccionario?[Math.floor(Math.random() * preguntaDiccionario.length)].
    let preguntaRandom = preguntaDiccionario[Math.floor(Math.random() * preguntaDiccionario.length)];
    this.preguntaGlobal = preguntaRandom.pregunta
    this.opcionRespuesta = preguntaRandom?.respuestas
    this.repuestaEsperada = preguntaRandom.correcta
  }



  ngAfterViewInit() {
    let ganadorTexto = document.getElementById("ganadorTexto")

    this.ruletaElementRef.nativeElement.addEventListener('animationend', () => {
      let currentRotation = this.getCurrentRotation(this.ruletaElementRef.nativeElement);
      this.ruletaElementRef.nativeElement.style.transform = "rotate(" + this.getCurrentRotation(this.ruletaElementRef.nativeElement) + "deg)"
      console.log(this.getCurrentRotation(this.ruletaElementRef.nativeElement))
      this.ruletaElementRef.nativeElement.classList.toggle("girar", false)
      this.sortenado = false

      let winningSegment = this.calculateWinningSegment(currentRotation);
      if (ganadorTexto) { ganadorTexto.textContent = this.conceptos[winningSegment] }
      clearInterval(this.animacionCarga)
      this.spinSound.pause();
      this.spinSound.currentTime = 0;
      this.stopSound.play()
      this.preguntasSeleccion(this.conceptos[winningSegment])
      this.startCountdown()
      this.areLabelsDisabled = false
      this.showformat = true

    });
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
  }
  calculateWinningSegment(rotation: number) {
    let degreesPerSegment = 360 / this.conceptos.length;
    // This will calculate the index of the concept in the array.
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

  sorteo() {
    this.spinSound.play();
    this.selectedOption = -1;
    this.showformat = false
    this.botonActivo = false
    if (this.sortenado) { return }

    let ganadorTexto = document.getElementById("ganadorTexto")
    if (ganadorTexto) { ganadorTexto.textContent = "." }
    this.sortenado = true
    this.animacionCarga = setInterval(() => {
      if (ganadorTexto) {
        switch (ganadorTexto.textContent) {
          case ".":
            ganadorTexto.textContent = ".."
            break
          case "..":
            ganadorTexto.textContent = "..."
            break
          case "...":
            ganadorTexto.textContent = "."
            break
          default:
            ganadorTexto.textContent = "."
            break

        }
      }

    }, 500)

    
    let ruleta = document.getElementById("ruleta")
    let ganador = Math.random();
    // console.log(ganador)
    // console.log("ganador: " +ganador)

    ruleta?.classList.toggle("girar", true)
    let duracionGiro = 10 * 360 + (1 - ganador) * 360
    this.root.style.setProperty("--giroRuleta", duracionGiro + "deg")

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




}