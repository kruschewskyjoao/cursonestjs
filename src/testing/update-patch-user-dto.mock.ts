import { Role } from '../enums/role.enum';
import { UpdatePatchUserDTO } from '../user/dto/update-update-user.dto';

// patch não precisa modificar tudo. ele muda apenas o campo fornecido.
export const updatePatchUserDTO: UpdatePatchUserDTO = {
  role: Role.Admin,
};
