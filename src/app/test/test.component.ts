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
  jsonData:any;
  study = true;
  respuestasCorrectas: number = 0;
  respuestasIncorrectas: number = 0;
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id')!;
      this.loadJsonData(id);
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
    
        // Marca la pregunta como respondida
        pregunta.respondida = true;
    
        // Marca la respuesta como seleccionada
        respuesta.seleccionada = true;
    
        // Muestra la respuesta correcta
        pregunta.mostrarCorrecta = true;
    
        // Verifica si la respuesta seleccionada es correcta
        if (respuesta.respuestaSN == -1) {
          this.respuestasCorrectas++;
        } else {
          this.respuestasIncorrectas++;
        }
      }
    
}
