import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false; // Zmienna do śledzenia, czy formularz został wysłany
  showErrors = false; // Zmienna do kontrolowania wyświetlania błędów

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true; // Ustaw zmienną na true przy wysyłaniu
    this.showErrors = true; // Włącz wyświetlanie błędów

    if (this.contactForm.valid) {
      console.log('Form Submitted!', this.contactForm.value);
      // Resetuj formularz po wysłaniu
      this.contactForm.reset();
      this.submitted = true; // Zresetuj zmienną, aby ukryć komunikaty
      this.showErrors = false; // Ukryj komunikaty o błędach
    }
  }
}
