import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class AuthStore {

    private readonly router: Router = inject(Router);

    guardarToken(token: string): void {
        sessionStorage.setItem("accessToken", token);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem("accessToken");
    }

    obtenerEmail(): string | null{
        const token = this.obtenerToken();
        
        if (!token) {
            return null;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.email;
    }

   
    estaAutenticado(): boolean {
        return this.obtenerToken() !== null;
    }

    obtenerRol(): string | null {
        const token = this.obtenerToken();

        if (!token) {
            return null;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));

        return payload.rol;
    }

    obtenerNombre(): string | null {
    const token = this.obtenerToken();  
    if(!token) {
        return null;
    }

    const payload = JSON.parse(
        new TextDecoder().decode(
            Uint8Array.from(atob(token.split(".")[1]), c => c.charCodeAt(0))
        )
    );

    return payload.nombres;
}

    cerrarSesion(): void {
        sessionStorage.removeItem("accessToken");
        this.router.navigateByUrl("/login");
    }
}