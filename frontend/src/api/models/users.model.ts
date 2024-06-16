import { z } from "zod";

export namespace UsersDto {
  export const Genders = z.enum(["male", "female"]);

  export type Genders = z.infer<typeof UsersDto.Genders>;

  export const genderValues: Genders[] = ["male", "female"];
  export const Shifts = z.enum(["1", "2H", "1(Н)", "2(Н)", "5"]);

  export type Shifts = z.infer<typeof UsersDto.Shifts>;

  export const shiftsValues: Shifts[] = ["1", "2H", "1(Н)", "2(Н)", "5"];

  //"admin""specialist""operator""worker"
  export const Roles = z.enum(["admin", "worker", "operator", "specialist"]);

  export type Roles = z.infer<typeof UsersDto.Roles>;

  export const rolesValues: Roles[] = [
    "admin",
    "worker",
    "operator",
    "specialist",
  ];

  export const Ranks = z.enum(["ЦУ", "ЦСИ", "ЦИО", "ЦИ", "ЦА"]);

  export type Ranks = z.infer<typeof UsersDto.Ranks>;

  export const ranksValues: Ranks[] = ["ЦУ", "ЦСИ", "ЦИО", "ЦИ"];

  export const Areas = z.enum([
    "ЦУ-1",
    "ЦУ-2",
    "ЦУ-3",
    "ЦУ-3 (Н)",
    "ЦУ-4",
    "ЦУ-4 (Н)",
    "ЦУ-5",
    "ЦУ-8",
  ]);

  export const areasValues = [
    "ЦУ-1",
    "ЦУ-2",
    "ЦУ-3",
    "ЦУ-3 (Н)",
    "ЦУ-4",
    "ЦУ-4 (Н)",
    "ЦУ-5",
    "ЦУ-8",
  ];

  export type Areas = z.infer<typeof UsersDto.Areas>;

  //Время работы сотрудников на участках:
  // ● 7:00 - 19:00, 8:00 - 20:00 – ЦУ-1, ЦУ-2, ЦУ-8
  // ● 7:00 - 19:00, 8:00 - 20:00, 10:00 - 22:00 – ЦУ-3, ЦУ-4, ЦУ-5
  // ● 20:00 - 8:00 – ЦУ-3(Н), ЦУ-4(Н
  export const WorkingHours = z.enum([
    "07:00-19:00",
    "08:00-20:00",
    "20:00-08:00",
    "08:00-17:00",
    "10:00-22:00",
  ]);

  export type WorkingHours = z.infer<typeof UsersDto.WorkingHours>;

  export const workingHoursValues: WorkingHours[] = [
    "07:00-19:00",
    "08:00-20:00",
    "20:00-08:00",
    "08:00-17:00",
  ];

  export const User = z.object({
    id: z.number(),
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    work_phone: z.string(),
    personal_phone: z.string(),
    personnel_number: z.string(),
    role: Roles,
    rank: Ranks,
    shift: Shifts,
    working_hours: z.string(),
    sex: Genders,
    area: Areas,
    is_lite: z.boolean(),
  });

  export type User = z.infer<typeof UsersDto.User>;

  export const UserForm = z.object({
    first_name: z.string().min(1, { message: "Имя обязательно" }),
    second_name: z.string().min(1, { message: "Фамилия обязательна" }),
    patronymic: z.string().min(1, { message: "Отчество обязательно" }),
    work_phone: z
      .string()
      .min(1, { message: "Рабочий номер телефона обязателен" }),
    personal_phone: z
      .string()
      .min(1, { message: "Личный номер телефона обязателен" }),
    personnel_number: z
      .string()
      .min(1, { message: "Табельный номер обязателен" }),
    role: Roles,
    rank: Ranks,
    shift: Shifts,
    working_hours: z.string().min(1, { message: "Рабочие часы обязательны" }),
    sex: Genders,
    area: Areas,
    is_lite: z.boolean().optional(),
    password: z.string().min(1, { message: "Пароль обязателен" }),
  });

  export type UserForm = z.infer<typeof UsersDto.UserForm>;

  export const UserUpdateForm = z.object({
    first_name: z.string().min(1, { message: "Имя обязательно" }),
    second_name: z.string().min(1, { message: "Фамилия обязательна" }),
    patronymic: z.string().min(1, { message: "Отчество обязательно" }),
    work_phone: z
      .string()
      .min(1, { message: "Рабочий номер телефона обязателен" }),
    personal_phone: z
      .string()
      .min(1, { message: "Личный номер телефона обязателен" }),
    personnel_number: z
      .string()
      .min(1, { message: "Табельный номер обязателен" }),
    role: Roles,
    rank: Ranks,
    shift: Shifts,
    working_hours: z.string().min(1, { message: "Рабочие часы обязательны" }),
    sex: Genders,
    area: Areas,
    is_lite: z.boolean().optional(),
  });

  export type UserUpdateForm = z.infer<typeof UsersDto.UserUpdateForm>;

  const localizedGender: Record<Genders, string> = {
    male: "Мужской",
    female: "Женский",
  };

  export const localizeGender = (gender: Genders) => localizedGender[gender];

  const localizedRole: Record<Roles, string> = {
    admin: "Администратор",
    worker: "Сотрудник",
    operator: "Оператор",
    specialist: "Специалист",
  };

  export const localizeRole = (role: Roles) => localizedRole[role];

  //getWorkingHours by area
  ////Время работы сотрудников на участках:
  // // ● 7:00 - 19:00, 8:00 - 20:00 – ЦУ-1, ЦУ-2, ЦУ-8
  // // ● 7:00 - 19:00, 8:00 - 20:00, 10:00 - 22:00 – ЦУ-3, ЦУ-4, ЦУ-5
  // // ● 20:00 - 8:00 – ЦУ-3(Н), ЦУ-4(Н

  export const getWorkingHours = (area: Areas): WorkingHours[] => {
    switch (area) {
      case "ЦУ-1":
      case "ЦУ-2":
      case "ЦУ-8":
        return ["07:00-19:00", "08:00-20:00"];
      case "ЦУ-3":
      case "ЦУ-4":
      case "ЦУ-5":
        return ["07:00-19:00", "08:00-20:00", "10:00-22:00"];
      case "ЦУ-3 (Н)":
      case "ЦУ-4 (Н)":
        return ["20:00-08:00"];
      default:
        return [];
    }
  };

  export const convertUserToForm = (user: User): UserUpdateForm => {
    return {
      area: user.area,
      sex: user.sex,
      first_name: user.first_name,
      second_name: user.second_name,
      patronymic: user.patronymic,
      work_phone: user.work_phone,
      personal_phone: user.personal_phone,
      personnel_number: user.personnel_number,
      role: user.role,
      rank: user.rank,
      shift: user.shift,
      working_hours: user.working_hours,
    };
  };
}
