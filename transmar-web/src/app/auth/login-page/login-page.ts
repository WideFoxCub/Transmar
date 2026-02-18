import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html'
})
export class LoginPage {
  username = 'admin';
  password = 'admin';
  error: string | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  login(): void {
    this.error = null;
    this.loading = true;

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/products');
      },
      error: () => {
        this.loading = false;
        this.error = 'Incorrect login or password';
      }
    });
  }
}
