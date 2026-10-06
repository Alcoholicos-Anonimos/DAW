import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginApiClient } from "./login-api-client";
import { AuthStore } from "../auth-store";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ]
})
export class Login {

    private readonly snackBar: MatSnackBar = inject(MatSnackBar);

    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);

    private readonly authStore: AuthStore = inject(AuthStore);

    private readonly router: Router = inject(Router)

    verClave = false;

    form: FormGroup = new FormGroup({
        email: new FormControl(null, Validators.required),
        clave: new FormControl(null, Validators.required)
    });

    mostrarError(mensaje: string) {
        this.snackBar.open(mensaje, "Cerrar", { duration: 5000 });
    }

    iniciarSesion() {

        if (!this.form.valid) {
            this.mostrarError("Es necesario completar todos los campos del formulario para avanzar")
            return
        }

        const email: string = this.form.value.email;

        const clave: string = this.form.value.clave;

        this.loginApiClient.iniciarSesion(email, clave).subscribe({
            next: (res)=>{
                this.authStore.guardarToken(res.accessToken);
                this.router.navigateByUrl("/reservas");
            },
            error: (err)=>{
                 this.mostrarError(err.error)
                //this.mostrarError("Ha ocurrido un error al iniciar sesión. Verifique las credenciales ingresadas")
            }
        });

    }
}
