import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonInputPasswordToggle,
  IonButton,
} from '@ionic/angular/standalone';
import { MasterService } from 'src/app/services/master.service';
import { LogInFooterComponent } from '../log-in-footer/log-in-footer.component';
import { CountryCodeComponent } from 'src/app/country-code/country-code.component';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss'],
  imports: [
    /* IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonInputPasswordToggle,
    IonButton */
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    LogInFooterComponent,
  ],
})
export class LogInFormComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private masterService: MasterService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initiateLoginForm();
  }

  initiateLoginForm() {
    this.loginForm = new FormGroup({
      phoneCode: new FormControl(''),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$'
        ),
      ]),
    });
  }
  userLogin() {
    let loginDetails = this.loginForm.value;
    this.masterService.login({ ...loginDetails, userType: 'PLAYER' }).subscribe(
      (res: any) => {
        if (res) {
          this.userService.setUser(res);
          this.authService.authToken = res.accessToken;
          this.authService.setRefreshToken(res.refreshToken);
          this.router.navigateByUrl('/tabs/tab1');
        }
      },
      (err) => {}
    );
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCodeComponent,
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25, 0.75],
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    console.log(data, 'test');
    this.loginForm.patchValue({ phoneCode: data });
  }
  reDirectToResetPassword(){
    this.router.navigateByUrl('/app-reset-pass-form-step1');
  }

}
