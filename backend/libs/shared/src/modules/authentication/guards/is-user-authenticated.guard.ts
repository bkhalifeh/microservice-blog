// import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ExtractJwt } from 'passport-jwt';
// import { Request } from 'express';
// export class IsUserAuthenticatedGuard implements CanActivate {
//   private readonly extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();
//   constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}
//   canActivate(context: ExecutionContext): boolean {
//     const req: Request = context.switchToHttp().getRequest();
//     const jwt = this.extractJwt(req);
//     if (jwt) {
//       try {
//         const user = this.jwtService.verify(jwt, {
//           algorithms: ['RS256'],
//         });
//         if (user) {
//           req.user = user;
//           return true;
//         } else {
//           return false;
//         }
//       } catch (e) {
//         console.log(e);
//         return false;
//       }
//     }
//     return false;
//   }
// }

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IsUserAuthenticatedGuard extends AuthGuard('jwt') {}
