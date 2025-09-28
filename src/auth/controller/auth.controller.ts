import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { LoginUserRequestDto } from '../dtos/login-user-request.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { LogOutRequestDto } from '../dtos/logout-request.dto';

@Injectable()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'login user' })
  @ApiResponse({
    status: 200,
    description: 'Both access and refresh refreshToken ',
  })
  @Post('/login')
  async login(@Body() loginUserRequestDto: LoginUserRequestDto) {
    return this.authService.login(loginUserRequestDto);
  }

  @ApiOperation({
    summary:
      'Refresh the users token to grant another access token after the previous one has expired',
  })
  @ApiResponse({ status: 200, description: 'Both access and refresh token ' })
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto) {
    return this.authService.refreshToken(refreshTokenRequestDto);
  }

  @ApiOperation({
    summary:
      'This will remove the users refresh token from the document, so they will not be authenticated until they log in again ',
  })
  @ApiResponse({ status: 200, description: ' ' })
  @Post('/logout')
  async logout(@Body() logOutRequestDto: LogOutRequestDto) {
    return this.authService.logout(logOutRequestDto);
  }
}
