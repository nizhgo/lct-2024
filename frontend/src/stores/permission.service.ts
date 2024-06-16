import { z } from "zod";
import AuthService from "src/stores/auth.service.ts";
import { makeAutoObservable } from "mobx";

export const Roles = z.enum(["admin", "worker", "operator", "specialist"]);

const PermissionService = new (class PermissionService {
  #userRole = AuthService.user?.role;
  constructor() {
    makeAutoObservable(this);
  }
  isUserAdmin() {
    return this.#userRole === "admin";
  }

  isUserStaff() {
    return this.#userRole === "worker";
  }

  isUserOperator() {
    return this.#userRole === "operator";
  }

  isUserSpecialist() {
    return this.#userRole === "specialist";
  }
})();

export default PermissionService;
