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
    fronteras: ['', Validators.required ]
  });

  // llenar selector regiones
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  constructor( private fb: FormBuilder, private paisesService: PaisesService ) { }

  ngOnInit(): void {
    
    this.regiones = this.paisesService.regiones;

    // Cuando cambia la región
    this.miFormulario.get('region')?.valueChanges
    .pipe( 
      tap( _ => {

        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
        
        // this.miFormulario.get('fronteras')?.disable();

      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ))
    )
    .subscribe( paises => {

      this.paises = paises;
      this.cargando = false;
      
    });

    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
    .pipe(

      tap( () => { 

        // cuando se modifica el país se vacía el arreglo
        this.miFormulario.get('fronteras')?.reset('');
        this.cargando = true;
        
        //this.miFormulario.get('fronteras')?.enable();

      }), 

      switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
      switchMap( pais =>  this.paisesService.getPaisesPorCodigos( pais?.borders! ))
    )
    .subscribe( paises => {
      // Si pais.bordes no tiene nada es igual a null o a un arreglo vacío
      // this.fronteras = pais?.borders || [];
      this.fronteras = paises;
      this.cargando = false;
    });

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
