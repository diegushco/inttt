import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;
  title = 'inttt';
  jsonData: any = null;
  sequence:any = [];
   acc = 0;
   study:boolean = false;
  constructor(private http: HttpClient) {}


  ngOnInit() {
    this.acc++;
     this.sequence = this.generateRandomSequence(93);
    this.loadJsonData(this.sequence.pop());
  }

  generateRandomSequence(n:any) {
    // Crear un array con números del 1 al n
    let numbers = Array.from({length: n}, (_, i) => i + 1);
    
    // Mezclar el array
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    return numbers;
}


  getJsonData(filename: string): Observable<any> {
    return this.http.get(`/${filename}`);
  }

  loadJsonData(num:any) {
    
      this.getJsonData('dummy/'+(num)+'.json').subscribe(
        (data) => {
          this.jsonData = data;
          console.log('JSON data loaded:', this.jsonData);
          setTimeout(() => {
            this.startAutoScroll()
          }, 3000);
        },
        (error) => {
          console.error('Error loading JSON data:', error);
        }
      );
    

  }

  startAutoScroll() {
    const container = this.scrollContainer.nativeElement;
    const scrollHeight = container.scrollHeight;
    const duration = scrollHeight * 40; // Ajusta este valor para controlar la velocidad

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (this.study) return; 
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      container.scrollTop = scrollHeight * percentage;

      if (percentage < 1) {
        requestAnimationFrame(step);
      } else {
        // El scroll ha llegado al final
        this.loadJsonData(this.sequence.pop());
        this.acc++;
      }
    };

    requestAnimationFrame(step);
  }
}
