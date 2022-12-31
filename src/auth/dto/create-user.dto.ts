import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const messageMailString = 'Debe Ingresar su correo';
const messageMailValidator = 'Debe ser un correo válido';
const passWordValidation = 'La contraseña es obligatoria';
const messageMin = 'La constraseña debe tener como mínimo 6 caracteres';
const messageMax = 'La constraseña debe tener como máximo 12 caracteres';
const messageMatches =
  'La contraseña debe tener debe ser alfa numérica y con al menos una Mayúscula';
const passValidation =
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
const nameValidator = 'El nombre debe ser llenado';
export class CreateUserDTO {
  @IsString({ message: messageMailString })
  @IsEmail(undefined, { message: messageMailValidator })
  email: string;

  @IsString({ message: passWordValidation })
  @MinLength(6, { message: messageMin })
  @MaxLength(12, { message: messageMax })
  @Matches(passValidation, { message: messageMatches })
  password: string;

  @IsString({ message: nameValidator })
  fullName: string;
}
