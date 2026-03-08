import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class QueryRequest {
  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de registros por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Campo para ordenação' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

export class OrderQueryRequest extends QueryRequest {
  @ApiPropertyOptional({ description: 'Data inicial para filtro (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data final para filtro (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Valor total mínimo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotalValue?: number;

  @ApiPropertyOptional({ description: 'Valor total máximo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotalValue?: number;

  @ApiPropertyOptional({
    description: 'ID do usuário (Apenas Admin pode filtrar outros)',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
