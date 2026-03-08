import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class ItemVO {
  @AutoMap()
  @ApiProperty({ description: 'ID do produto', example: 123 })
  @IsNumber()
  @IsNotEmpty({ message: 'O ID do produto é obrigatório' })
  idItem: number;

  @AutoMap()
  @ApiProperty({ description: 'Quantidade do item', example: 5 })
  @IsNumber()
  @IsNotEmpty({ message: 'A quantidade é obrigatória' })
  quantidadeItem: number;

  @AutoMap()
  @ApiProperty({ description: 'Valor do item', example: 1500 })
  @IsNumber()
  @IsNotEmpty({ message: 'O valor do item é obrigatório' })
  valorItem: number;
}

export class OrderVO {
  @AutoMap()
  @ApiProperty({ description: 'Número do pedido', example: 'v20241020abc-01' })
  @IsString()
  @IsNotEmpty({ message: 'O número do pedido é obrigatório' })
  numeroPedido: string;

  @AutoMap()
  @ApiProperty({ description: 'Valor total', example: 7500 })
  @IsNumber()
  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  valorTotal: number;

  @AutoMap()
  @ApiProperty({
    description: 'Data de criação',
    example: '2024-10-20T08:30:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'A data de criação é obrigatória' })
  dataCriacao: string;

  @AutoMap(() => ItemVO)
  @ApiProperty({ type: [ItemVO], description: 'Itens do pedido' })
  @IsArray()
  @IsNotEmpty({ message: 'A lista de itens não pode estar vazia' })
  @ValidateNested({ each: true })
  @Type(() => ItemVO)
  items: ItemVO[];
}

export class OrderReturnAdmVO extends OrderVO {
  @AutoMap()
  @ApiProperty({ description: 'Nome do dono do pedido', example: 'João Silva' })
  userName: string;

  @AutoMap()
  @ApiProperty({
    description: 'E-mail do dono do pedido',
    example: 'joao@email.com',
  })
  userEmail: string;
}
