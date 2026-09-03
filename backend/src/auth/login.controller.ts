import { Body, Controller, NotImplementedException, Post } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto.js";

@Controller("/auth")
export class LoginController {

    constructor() { }

    @Post()
    async login(@Body() dto: LoginDTO): Promise<{ accessToken: string }> {
        throw new NotImplementedException();
    }

}