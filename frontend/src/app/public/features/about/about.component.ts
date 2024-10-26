import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  title: string = 'O Projekcie';
  description: string =
    'To jest przykładowy projekt wykorzystujący Angular na frontendzie i Express.js na backendzie.';
  version: string = '1.0.0';
  author: string = 'Twoje Imię';
}
