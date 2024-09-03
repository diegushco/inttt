import { CommonModule, ViewportScroller } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-scroll',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './scroll.component.html',
  styleUrl: './scroll.component.scss'
})
export class ScrollComponent implements OnInit, OnDestroy{
  @ViewChild('scrollContainer')
  private scrollContainer!: ElementRef;
  title = 'inttt';
  jsonData: any = null;
  sequence:any = [];
   acc = 0;
   study:boolean = false;

  final = false;

  private destroy$ = new Subject<void>();
  private timeouts: any[] = [];

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
//inttt/live/
    const url_dummy = this.final?'inttt/live/dummy/repaso'+(num)+'.json':'inttt/live/dummy/'+(num)+'.json';

    this.acc++;
      this.getJsonData(url_dummy).subscribe(
        (data) => {
          this.jsonData = data;
          console.log('JSON data loaded:', this.jsonData);
          const timeoutId =  setTimeout(() => {
            this.startAutoScroll()
          }, 2000);
          this.timeouts.push(timeoutId);
        },
        (error) => {
          console.error('Error loading JSON data:', error);
        }
      );
    

  }

  next(){
    this.loadJsonData(this.sequence.pop());
  
    const timeoutId = setTimeout(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    }, 2000);
    this.timeouts.push(timeoutId);
  }
  private animationFrameId: number | null = null;
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
        
        this.animationFrameId =requestAnimationFrame(step);
      } else {
        // El scroll ha llegado al final
        this.loadJsonData(this.sequence.pop());
        
      }
    };

    this.animationFrameId =requestAnimationFrame(step);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Cancelar todos los timeouts
    this.timeouts.forEach(clearTimeout);
    
    // Cancelar cualquier animación en curso
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
