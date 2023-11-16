import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';

// Vai ter tudo que tem na CreateUserDTO
export class UpdatePatchUserDTO extends PartialType(CreateUserDTO) {}
