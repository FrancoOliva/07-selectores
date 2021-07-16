import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// pipe - nos sirve para implementar métodos rxjs
// switchMap - toma el valor producto de un observable y a su vez lo muta 
// y regresa el valor de otro observable
import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interface/paises.interface';



@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styles: [
  ]
})
export class SelectorComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required ],
    pais: ['', Validators.required ],
    frontera: ['', Validators.required ]
  });

  // llenar selector regiones
  regiones: string[] = [];
  paises: PaisSmall[] = [];

  constructor( private fb: FormBuilder, private paisesService: PaisesService ) { }

  ngOnInit(): void {
    
    this.regiones = this.paisesService.regiones;

    // Cuando cambia la región
    this.miFormulario.get('region')?.valueChanges
    .pipe( 
      tap( _ => {

        this.miFormulario.get('pais')?.reset('');

      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ))
    )
    .subscribe( paises => {

      this.paises = paises;
      
    });

    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
    .subscribe( codigo => {
      console.log(codigo);
    });

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
