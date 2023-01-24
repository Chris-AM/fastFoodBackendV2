import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    default: 10,
    description: 'How many results are going to be shown',
  })
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many results are going to be skipped',
  })
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}
