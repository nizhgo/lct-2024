import { UsersDto } from "api/models/users.model.ts";
import { makeAutoObservable } from "mobx";
import AuthService from "src/stores/auth.service.ts";

export const Sections = [
  "requests",
  "passengers",
  "staff",
  "schedule",
  "profile",
] as const;
export type Section = (typeof Sections)[number];

export type Permission = "read" | "create" | "update" | "delete" | "*" | "none";

export interface RolePermissions {
  requests: Permission[];
  passengers: Permission[];
  staff: Permission[];
  schedule: Permission[];
  profile: Permission[];
}

const PermissionsService = new (class PermissionsService {
  permissions: Record<UsersDto.Roles, RolePermissions>;

  constructor() {
    this.permissions = {
      admin: {
        requests: ["*"],
        passengers: ["*"],
        staff: ["*"],
        schedule: ["*"],
        profile: ["*"],
      },
      worker: {
        requests: ["read"],
        passengers: ["none"],
        staff: ["none"],
        schedule: ["none"],
        profile: ["read"],
      },
      operator: {
        requests: ["read", "create", "update"],
        passengers: ["read", "create", "update"],
        staff: ["read", "create"],
        schedule: ["read"],
        profile: ["read", "update"],
      },
      specialist: {
        requests: ["read"],
        passengers: ["read"],
        staff: ["read"],
        schedule: ["read"],
        profile: ["read"],
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
    const permissions = this.getPermissions(section);
    return permissions.includes("read") || permissions.includes("*");
  }

  canCreate(section: Section): boolean {
    const permissions = this.getPermissions(section);
    return permissions.includes("create") || permissions.includes("*");
  }

  canUpdate(section: Section): boolean {
    const permissions = this.getPermissions(section);
    return permissions.includes("update") || permissions.includes("*");
  }

  hasPermissions(section: Section, requiredPermissions: Permission[]): boolean {
    const permissions = this.getPermissions(section);
    //check by none
    if (permissions.includes("none")) {
      return false;
    }
    return requiredPermissions.every((perm) => permissions.includes(perm) || permissions.includes("*"));
  }
})();

export default PermissionsService;
