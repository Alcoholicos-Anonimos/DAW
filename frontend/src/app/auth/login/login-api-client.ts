import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class LoginApiClient{

    private readonly httpClient: HttpClient = inject(HttpClient)

    iniciarSesion(email: string, clave: string): Observable<{accessToken: string}>{

        //////// TENEMOS QUE VER COMO PONER EL LOCAL HOST SIN HARDCODEAR
        const url = "http://localhost:3000/api/v1/auth/login";
        return this.httpClient.post<{accessToken:string}>(url, {email, clave});

    }

}