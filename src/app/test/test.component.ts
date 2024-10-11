import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit{
  jsonData:any =  {}
  study = true;
  respuestasCorrectas: number = 0;
  respuestasIncorrectas: number = 0;
  private key = 'inttt';
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id')!;
      console.log("ID", id)
      if(id=='error-1'){
        this.jsonData["preguntas"] = this.getArray();
      }else{
        this.loadJsonData(id);
      }
      //this.loadJsonData(id);
  }

  getJsonData(filename: string): Observable<any> {
    return this.http.get(`/${filename}`);
  }

  loadJsonData(num:any) {
    //inttt/live/
        const url_dummy = 'inttt/live/dummy/'+(num)+'.json';
    
      
          this.getJsonData(url_dummy).subscribe(
            (data) => {
              this.jsonData = data;
              console.log('JSON data loaded:', this.jsonData);
              
            },
            (error) => {
              console.error('Error loading JSON data:', error);
            }
          );
        
    
      }

      seleccionarRespuesta(pregunta: any, respuesta: any, index: number) {
        // Verifica si la pregunta ya ha sido respondida
        if (pregunta.respondida) {
          return; // Si ya fue respondida, no hace nada
        }

        if (respuesta.respuestaSN == -1) {
          this.respuestasCorrectas++;
        } else {
          this.respuestasIncorrectas++;
          this.addItem(pregunta);
        }
    
        // Marca la pregunta como respondida
        pregunta.respondida = respuesta.respuestaSN == -1?-1:1;
        
        // Marca la respuesta como seleccionada
        respuesta.seleccionada = true;
    
        // Muestra la respuesta correcta
        pregunta.mostrarCorrecta = true;
    
        // Verifica si la respuesta seleccionada es correcta
        
      }

      getArray(): any[] {
        const storedValue = localStorage.getItem(this.key);
        return storedValue ? JSON.parse(storedValue) : [];
      }
    
      addItem(item: any): boolean {
        const array = this.getArray();
        
        // Verificar si el item ya existe en el array
        const exists = array.some(existingItem => 
          JSON.stringify(existingItem) === JSON.stringify(item)
        );
    
        if (!exists) {
          array.push(item);
          this.saveArray(array);
          return true; // Indica que el item fue añadido
        }
    
        return false; // Indica que el item ya existía y no fue añadido
      }
    
      private saveArray(array: any[]): void {
        localStorage.setItem(this.key, JSON.stringify(array));
      }
    
}
