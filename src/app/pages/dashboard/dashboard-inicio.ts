import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-inicio',
  standalone: true,
  styleUrl: './dashboard.scss',
  template: `
      <header>
          <h1 class="title">Frontend</h1>
      </header>
      <div class="content-columns">
          Presentando un Frontend
      </div>
  `
})
export class DashboardInicioComponent {

}