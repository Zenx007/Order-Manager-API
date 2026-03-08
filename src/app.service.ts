import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IUserRepository } from './Core/RepositoriesInterface/IUserRepository.interface';
import { Role } from './Core/Enums/Role.enum';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = 'admin@gmail.com';
    const checkAdmin = await this.userRepository.findByEmailAsync(adminEmail);

    if (checkAdmin.isSuccess && !checkAdmin.value) {
      console.log('Semeando usuário administrador padrão...');

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('abc123', salt);

      const createAdm = await this.userRepository.insertAsync({
        Id: randomUUID(),
        Name: 'Admin',
        Email: adminEmail,
        Senha: hashedPassword,
        Role: Role.ADMIN,
        orders: [],
      });

      if (createAdm.isFailed) {
        console.error('Erro ao criar usuário administrador:', createAdm.errors);
      } else {
        console.log(
          'Administrador criado com sucesso: admin@gmail.com / abc123',
        );
      }
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
