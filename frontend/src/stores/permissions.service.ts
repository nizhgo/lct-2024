import { UsersDto } from "api/models/users.model.ts";
import { makeAutoObservable } from "mobx";
import AuthService from "src/stores/auth.service.ts";

export const Sections = [
  "requests",
  "passengers",
  "staff",
  "schedule",
] as const;
export type Section = (typeof Sections)[number];

export type Permission = "read" | "create" | "update";

export interface RolePermissions {
  requests: Permission[];
  passengers: Permission[];
  staff: Permission[];
  schedule: Permission[];
}

const PermissionsService = new (class PermissionsService {
  permissions: Record<UsersDto.Roles, RolePermissions>;

  constructor() {
    this.permissions = {
      admin: {
        requests: ["read", "create", "update"],
        passengers: ["read", "create", "update"],
        staff: ["read", "create", "update"],
        schedule: ["read"],
      },
      worker: {
        requests: ["read"],
        passengers: ["read"],
        staff: ["read"],
        schedule: ["read"],
      },
      operator: {
        requests: ["read", "create", "update"],
        passengers: ["read", "create", "update"],
        staff: ["read", "create"],
        schedule: ["read"],
      },
      specialist: {
        requests: ["read"],
        passengers: ["read"],
        staff: ["read"],
        schedule: ["read"],
      },
    };
    makeAutoObservable(this);
  }

  getRole(): UsersDto.Roles {
    return AuthService.role;
  }

  getPermissions(section: Section): Permission[] {
    const role = this.getRole();
    return this.permissions[role][section];
  }

  canRead(section: Section): boolean {
    return this.getPermissions(section).includes("read");
  }

  canCreate(section: Section): boolean {
    return this.getPermissions(section).includes("create");
  }

  canUpdate(section: Section): boolean {
    return this.getPermissions(section).includes("update");
  }
})();

export default PermissionsService;
