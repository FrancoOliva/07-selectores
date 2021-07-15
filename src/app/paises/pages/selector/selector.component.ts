import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required ]
  });

  // llenar selector regiones
  regiones: string[] = [];

  constructor( private fb: FormBuilder, private paisesService: PaisesService ) { }

  ngOnInit(): void {
    
    this.regiones = this.paisesService.regiones;

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
