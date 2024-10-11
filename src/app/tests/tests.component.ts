import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent {

  constructor(private router: Router){}
  arrayDel1Al10 = Array.from({ length: 10 }, (_, index) => index + 1);
  arrayDel1Al93 = Array.from({ length: 93 }, (_, index) => index + 1);
  arrayDel1Al15 = Array.from({ length: 15 }, (_, index) => index + 1);

  goTest(num:Number, type:string) {
    this.router.navigate(['/test', type+num]);


  }

  goError(num:Number, type:string) {
    this.router.navigate(['/test', type+num]);


  }

  clear(){
    localStorage.removeItem('inttt');
  }
}
