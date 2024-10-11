import { Routes } from '@angular/router';
import { ScrollComponent } from './scroll/scroll.component';
import { TestsComponent } from './tests/tests.component';
import { TestComponent } from './test/test.component';

export const routes: Routes = [
    { path: '', component: TestsComponent },
    {  path: 'tests', component: TestsComponent },
    {  path: 'test/:id', component: TestComponent },
];
