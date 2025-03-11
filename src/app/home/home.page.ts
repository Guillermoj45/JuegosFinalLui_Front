import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule
  ]
})
export class HomePage {
  username: string = '';
  difficultyLevel: number | null = null;

  constructor(private router: Router, private alertController: AlertController) {}

  startGame() {
    console.log("Hola");
    if (this.username.trim() !== '' && this.difficultyLevel !== null) {
      localStorage.setItem('username', this.username);
      localStorage.setItem('difficultyLevel', "1");
      this.router.navigate(['/juego']);
    } else {
      this.alertController.create({
        header: 'Error',
        message: 'Por favor, rellena todos los campos',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }
}
