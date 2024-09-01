import { CommonModule, ViewportScroller } from '@angular/common';
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

  final = false;

  constructor(private http: HttpClient, private viewportScroller: ViewportScroller) {}


  ngOnInit() {
   
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

  finalFn(){
    this.final = !this.final;
    this.sequence = this.generateRandomSequence((this.final)?15:93);
    this.loadJsonData(this.sequence.pop());
  }

  loadJsonData(num:any) {

    const url_dummy = this.final?'inttt/live/dummy/repaso'+(num)+'.json':'inttt/live/dummy/'+(num)+'.json';

    this.acc++;
      this.getJsonData(url_dummy).subscribe(
        (data) => {
          this.jsonData = data;
          console.log('JSON data loaded:', this.jsonData);
          setTimeout(() => {
            this.startAutoScroll()
          }, 2000);
        },
        (error) => {
          console.error('Error loading JSON data:', error);
        }
      );
    

  }

  next(){
    this.loadJsonData(this.sequence.pop());
  
    setTimeout(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    }, 2000);
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
        
      }
    };

    requestAnimationFrame(step);
  }
}
