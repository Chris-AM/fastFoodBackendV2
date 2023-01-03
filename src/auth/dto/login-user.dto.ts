import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MESSAGES } from '../../common/appMessages';

export class LoginUserDTO {
  @IsString({ message: MESSAGES.USERS.IS_MAIL_TYPED_VALIDATION })
  @IsEmail(undefined, { message: MESSAGES.USERS.IS_VALID_MAIL_VALIDATION })
  email: string;

  @IsString({ message: MESSAGES.USERS.IS_PASSWORD_TYPED_VALIDATION })
  @MinLength(6, { message: MESSAGES.USERS.PASSWORD_MIN_CHAR_VALIDATION })
  @MaxLength(12, { message: MESSAGES.USERS.PASSWORD_MAX_CHAR_VALIDATION })
  @Matches(MESSAGES.USERS.DOES_PASS_CONAIN_VALID_CHAR, {
    message: MESSAGES.USERS.DOES_PASS_MATCH_VALIDATION,
  })
  password: string;
}
