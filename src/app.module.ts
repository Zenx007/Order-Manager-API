import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AddControllers } from './API/Extensions/AddController';
import { AddProfiles } from './API/Extensions/AddProfiles';
import AddProviders from './API/Extensions/AddProviders';
import RepositoriesStartup from './API/Extensions/AddRepositories';
import ServicesStartup, {
  AllServicesInjects,
} from './API/Extensions/AddService';
import { DatabaseModule } from './Infrastructure/Database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { JwtModule } from '@nestjs/jwt';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfiguration from './app.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration],
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 5,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<any>('app.jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  controllers: [...AddControllers],
  providers: [
    AppService,
    ...AllServicesInjects,
    ...AddProviders,
    ...AddProfiles,
    ...RepositoriesStartup,
    ...ServicesStartup,
  ],
  exports: [
    ...AddProfiles,
    ...ServicesStartup,
    ...AddProviders,
    ...RepositoriesStartup,
  ],
})
export class AppModule {}
