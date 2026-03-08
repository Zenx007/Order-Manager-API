import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T = any> {
  @ApiProperty({
    description: 'Indica se a requisição foi bem sucedida',
    example: true,
  })
  success: boolean;

  @ApiProperty({ description: 'Objeto de retorno da requisição' })
  object: T | null;

  @ApiProperty({
    description: 'Mensagem de retorno',
    required: false,
    example: 'Operação realizada com sucesso.',
  })
  message?: string | null;

  @ApiProperty({
    description: 'Código numérico de status',
    default: 0,
    example: 200,
  })
  number: number = 0;

  constructor() {
    this.success = false;
    this.object = null;
    this.message = null;
    this.number = 0;
  }
}
