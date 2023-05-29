import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-page-403',
  templateUrl: './page-403.component.html',
  styleUrls: ['./page-403.component.scss']
})
export class Page403Component {

  constructor(private router: Router, private auth: AuthService) { }

  voltar() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      // .catch(erro => this.errorHandler.handle(erro));
  }

  

}
