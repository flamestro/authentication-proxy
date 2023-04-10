import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticatorMiddleware } from './authenticator.middleware';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticatorMiddleware, ProxyMiddleware).forRoutes('*');
  }
}
