import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, OptionalAuth } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import {
  ForgotPasswordUserAuthDto,
  LoginUserAuthDto,
  RegisterUserAuthDto,
  ResetPasswordCallbackUserAuthParamsDto,
  ResetPasswordCallbackUserAuthQueryDto,
  ResetPasswordUserAuthDto,
  SendVerificationEmailUserAuthDto,
  VerifyEmailUserAuthQueryDto,
} from '@qiluer-resume/dto/dtos/user-auth';
import { LoginUserAuthVO, RegisterUserAuthVO, SessionUserAuthVO, UserAuthActionVO } from '@qiluer-resume/dto/vos/user-auth';
import type { UserAuthActionType, UserAuthSessionType, UserAuthUserType } from '@qiluer-resume/dto/schemas/user-auth';
import { UserAuthService } from './user-auth.service';

/** 把 Better Auth 产生的 Set-Cookie 原样写入 NestJS 响应。 */
function forwardSetCookie(headers: Headers, response: Response): void {
  const cookies = headers.getSetCookie();
  if (cookies.length > 0) response.setHeader('Set-Cookie', cookies);
}

/** 把 Better Auth 回调 Response 的状态、Location 和 Cookie 原样转发。 */
function forwardRedirect(upstream: globalThis.Response, response: Response): void {
  const location = upstream.headers.get('location');
  forwardSetCookie(upstream.headers, response);
  if (location) response.setHeader('Location', location);
  response.status(upstream.status).end();
}

@ApiTags('普通用户认证')
@Controller('user-auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户注册' })
  @ApiOkResponse({ type: RegisterUserAuthVO })
  @Post('register')
  async register(
    @Body() body: RegisterUserAuthDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserAuthUserType> {
    const result = await this.userAuthService.register(body, request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户登录' })
  @ApiOkResponse({ type: LoginUserAuthVO })
  @Post('login')
  async login(@Body() body: LoginUserAuthDto, @Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<UserAuthUserType> {
    const result = await this.userAuthService.login(body, request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }

  @ApiCookieAuth('user-session')
  @ApiOperation({ summary: 'C端用户退出登录' })
  @ApiOkResponse({ type: UserAuthActionVO })
  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<UserAuthActionType> {
    const result = await this.userAuthService.logout(request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }

  @OptionalAuth()
  @ApiCookieAuth('user-session')
  @ApiOperation({ summary: '查询当前普通用户 Session，游客返回 null' })
  @ApiOkResponse({ type: SessionUserAuthVO })
  @Get('session')
  async getSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: UserAuthUserType; session: UserAuthSessionType } | null> {
    const result = await this.userAuthService.getSession(request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户重新发送邮箱验证邮件' })
  @ApiOkResponse({ type: UserAuthActionVO })
  @Post('send-verification-email')
  async sendVerificationEmail(
    @Body() body: SendVerificationEmailUserAuthDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserAuthActionType> {
    const result = await this.userAuthService.sendVerificationEmail(body, request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户验证邮箱', description: '验证后重定向到可信前端地址' })
  @ApiFoundResponse({ description: '验证完成，或携带错误参数重定向到前端 callbackURL' })
  @Get('verify-email')
  async verifyEmail(@Query() query: VerifyEmailUserAuthQueryDto, @Req() request: Request, @Res() response: Response): Promise<void> {
    const upstream = await this.userAuthService.verifyEmail(query, request.headers);
    forwardRedirect(upstream, response);
  }

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户忘记密码', description: '发送重置密码邮件后重定向到可信前端地址' })
  @ApiOkResponse({ type: UserAuthActionVO })
  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordUserAuthDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserAuthActionType> {
    const result = await this.userAuthService.forgotPassword(body, request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户重置密码校验', description: '校验密码重置令牌并重定向到可信前端地址' })
  @ApiParam({ name: 'token', description: '一次性密码重置令牌' })
  @ApiFoundResponse({ description: '令牌有效时附加 token，失效时附加 error，并重定向到前端 callbackURL' })
  @Get('reset-password/:token')
  async resetPasswordCallback(
    @Param() params: ResetPasswordCallbackUserAuthParamsDto,
    @Query() query: ResetPasswordCallbackUserAuthQueryDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const upstream = await this.userAuthService.resetPasswordCallback(params, query, request.headers);
    forwardRedirect(upstream, response);
  }

  @AllowAnonymous()
  @ApiOperation({ summary: 'C端用户重置密码' })
  @ApiOkResponse({ type: UserAuthActionVO })
  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordUserAuthDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserAuthActionType> {
    const result = await this.userAuthService.resetPassword(body, request.headers);
    forwardSetCookie(result.headers, response);
    return result.data;
  }
}
