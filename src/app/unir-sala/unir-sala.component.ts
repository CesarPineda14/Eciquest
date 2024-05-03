import { Component, OnInit } from '@angular/core';
import { DataService } from '../comunicacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unir-sala',
  templateUrl: './unir-sala.component.html',
  styleUrls: ['./unir-sala.component.css']
})
export class UnirSalaComponent implements OnInit{
  
    constructor(private data: DataService, private router: Router) { }
    categorias: string[] = [];
  
    salaId: number = 0;
    codigoSala= 0;
    ngOnInit(): void {
      this.data.getCategories().subscribe(categories => {
        if(categories){
        this.categorias = categories;
        console.log(this.categorias, "categorias obtenidas");
        }
       
        
        
      });
    }
  
    sendData(): void {
      this.data.setSalaId(this.codigoSala);
      // this.data.setSalaBack()
      this.data.getCategories().subscribe(categorias => {
        console.log(categorias, "categorias");
        
        let pregunta = this.data.getNumPreguntas();
        let jugadores = this.data.getNumJugadores();
        this.data.setNumPreguntas(pregunta);
        this.data.setNumJugadores(jugadores);
        this.data.setCategories(categorias);
        this.router.navigate(['/SalaComponent']);
      });
    }

}
