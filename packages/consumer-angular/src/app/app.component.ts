import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loading = false;
  disabled = false;

  toggleLoading() {
    this.loading = !this.loading;
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  handleClick() {
    alert('Clicked!');
  }
}
