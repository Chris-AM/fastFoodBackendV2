import {
    IsBoolean,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MESSAGES } from '../../common/constants';

export class CreateUserDto {
  
  @IsString({ message: MESSAGES.USERS.IS_MAIL_TYPED_VALIDATION })
  @IsEmail(undefined, { message: MESSAGES.USERS.IS_VALID_MAIL_VALIDATION })
  email: string;

  @IsString({ message: MESSAGES.USERS.IS_PASSWORD_TYPED_VALIDATION })
  @MinLength(6, { message: MESSAGES.USERS.PASSWORD_MIN_CHAR_VALIDATION })
  @MaxLength(12, { message: MESSAGES.USERS.PASSWORD_MAX_CHAR_VALIDATION })
  @Matches(MESSAGES.USERS.DOES_PASS_CONTAIN_VALID_CHAR, {
    message: MESSAGES.USERS.DOES_PASS_MATCH_VALIDATION,
  })
  password: string;

  @IsString({ message: MESSAGES.USERS.IS_NAME_TYPED_VALIDATION })
  fullName: string;

  @IsBoolean()
  isActive: boolean;
  roles: string[];
  phone?: string;
  avatar?: string;
  address?: string;
}
