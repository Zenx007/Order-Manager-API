import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  MinLength,
} from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { Role } from '../../Core/Enums/Role.enum';

export class UserVO {
  @AutoMap()
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  Name: string;

  @AutoMap()
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'example@gmail.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  Email: string;

  @AutoMap()
  @ApiProperty({ description: 'Senha do usuário', example: 'abc123' })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  Senha: string;
}

export class UserUpdateVO {
  @AutoMap()
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  Name: string;

  @AutoMap()
  @ApiProperty({ description: 'E-mail do usuário', example: 'admin@gmail.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  Email: string;
}

export class ChangePasswordVO {
  @ApiProperty({ description: 'Senha atual', example: 'antiga123' })
  @IsString()
  @IsNotEmpty()
  SenhaAtual: string;

  @ApiProperty({ description: 'Nova senha', example: 'nova123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  NovaSenha: string;

  @ApiProperty({ description: 'Confirmação da nova senha', example: 'nova123' })
  @IsString()
  @IsNotEmpty()
  ConfirmacaoSenha: string;
}

export class LoginVO {
  @AutoMap()
  @ApiProperty({ description: 'E-mail do usuário', example: 'admin@gmail.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  Email: string;

  @AutoMap()
  @ApiProperty({ description: 'Senha do usuário', example: 'abc123' })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  Senha: string;
}

export class UserReturnVO {
  @AutoMap()
  @ApiProperty({
    description: 'ID do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  Id: string;

  @AutoMap()
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  Name: string;

  @AutoMap()
  @ApiProperty({ description: 'E-mail do usuário', example: 'admin@gmail.com' })
  Email: string;

  @AutoMap()
  @ApiProperty({
    enum: Role,
    description: 'Role do usuário',
    example: Role.USER,
  })
  Role: Role;
}

export class UserDataVO {
  @AutoMap()
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  Name: string;

  @AutoMap()
  @ApiProperty({ description: 'E-mail do usuário', example: 'admin@gmail.com' })
  Email: string;

  @AutoMap()
  @ApiProperty({
    enum: Role,
    description: 'Role do usuário',
    example: Role.USER,
  })
  Role: Role;
}

export class UserTokenVO {
  @AutoMap()
  @ApiProperty({ type: () => UserDataVO })
  User: UserDataVO;

  @AutoMap()
  @ApiProperty({
    description: 'Token de autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  Token: string;
}
