import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pax-canina';
}
