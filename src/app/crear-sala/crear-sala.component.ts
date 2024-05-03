import { Component } from '@angular/core';
import { DataService } from '../comunicacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.component.html',
  styleUrls: ['./crear-sala.component.css']
})
export class CrearSalaComponent {

  constructor(private data: DataService, private router: Router) { }
  categories = [
    { name: 'bases de datos', value: 'bases de datos' },
    { name: 'logica', value: 'logica' },
    { name: 'sistemas', value: 'sistemas' },
    { name: 'matematicas', value: 'matematicas' },
    { name: 'programacion', value: 'programacion' }
  ];

  selectedCategories: string[] = [];
  NumPreguntas: number = 0;
  numJugadores: number = 0;

  toggleCategory(category: any): void {
    if (!this.selectedCategories.includes(category)) {
      this.selectedCategories.push(category);
    }
    else {
      let index = this.selectedCategories.indexOf(category);
      this.selectedCategories.splice(index, 1);
    }
   
  }

  sendData(): void {
    let random = Math.floor(Math.random() * 10000);
    this.data.setSalaId(random);
    this.data.setCategories(this.selectedCategories);
    console.log(this.selectedCategories, "categorias");
    this.data.setNumPreguntas(this.NumPreguntas);
    this.data.setNumJugadores(this.numJugadores);
    
    
    this.router.navigate(['/SalaComponent']);
  }



}
