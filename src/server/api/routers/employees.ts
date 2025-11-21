import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { assignEmployeesToGroup, Group, GroupOption, groupsRouter } from "./groups";
import { env } from "~/env";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { ERROR_MESSAGES } from "~/lib/errors";
import { AssetRaw } from "./assets";
import { CategoryRaw } from "./categories";

export type EmployeeRaw = {
  id: string,
  nombre: string,
  apellido: string,
  mail: string | null,
  telefono: string | null,
  habilitado: boolean,
  assetsAsignados: AssetRaw[],
  // categoriasAssetsAsignadas: CategoryRaw[],
  // gruposAsignados: GroupRaw[]
}

type GroupInEmployee = {
  id: number,
  nombre: string
}

export type EmployeeWithGroupsRaw = EmployeeRaw & { grupos: GroupInEmployee[] }

export type Employee = EmployeeRaw & { grupos: string[] }

export type EmployeeForTable = Omit<EmployeeRaw,
  "assetsAsignados" | "categoriasAssetsAsignadas" | "gruposAsignados" | "telefono">

export type EmployeeOption = {
  value: string,
  label: string
}

export const employeesRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      const employeesResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!employeesResponse.ok) {
        const error = await employeesResponse.text()
        console.log("Ocurrió un problema pidiendo la lista completa de empleados con el siguiente mensaje de error:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }
      const employees: EmployeeRaw[] = await employeesResponse.json()
      // console.log(employees)
      return employees

    }),
  getAllForTable: publicProcedure
    .query(async () => {
      const allEmployees = await api.employees.getAll.query()
      const employeesForTable: EmployeeForTable[] = allEmployees.map(e => {
        return {
          id: e.id,
          nombre: e.nombre,
          apellido: e.apellido,
          mail: e.mail,
          habilitado: e.habilitado
        }
      })
      return employeesForTable
    }),
  getById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const employeeResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!employeeResponse.ok) {
        const error = await employeeResponse.text()
        console.log(`Ocurrió un problema pidiendo un empleado (id: ${input.id}) con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }
      const employee: EmployeeRaw = await employeeResponse.json()
      // console.log(employee)
      return employee

    }),
  getByIdWithGroups: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const employeeResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/conGrupos/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!employeeResponse.ok) {
        const error = await employeeResponse.text()
        console.log(`Ocurrió un problema pidiendo un empleado con grupos (id: ${input.id}) con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }
      const employee: EmployeeWithGroupsRaw = await employeeResponse.json()
      const { grupos, ...rest } = employee
      // console.log(employee)
      const groupsIds = grupos.map(group => {
        const { id } = group
        return id.toString()
      })
      return { grupos: groupsIds, ...rest } as Employee

    }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string(),
        apellido: z.string(),
        mail: z.string().email().nullish(),
        telefono: z.string().nullish(),
        groupIds: z.array(z.number()),
        habilitado: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      const { groupIds, ...employee } = input

      const createResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee)
        })

      if (!createResponse.ok) {
        const error = await createResponse.text()
        console.dir(`Ocurrió un problema creando un empleado\n ${employee}\n con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }

      groupIds.forEach(g => {
        assignEmployeesToGroup({ employees: [employee.id], groupId: g, assign: true })
      })
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string(),
        apellido: z.string(),
        mail: z.string().nullish(),
        telefono: z.string().nullish(),
        toAssign: z.array(z.number()),
        toUnassign: z.array(z.number()),
        habilitado: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      const { toAssign, toUnassign, ...employee } = input

      const editResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee)
        })

      if (!editResponse.ok) {
        const error = await editResponse.text()
        console.dir(`Ocurrió un problema editando un empleado\n ${employee}\n con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }
      toAssign.forEach(group => {
        assignEmployeesToGroup({ employees: [employee.id], groupId: group, assign: true })
      })
      toUnassign.forEach(group => {
        assignEmployeesToGroup({ employees: [employee.id], groupId: group, assign: false })
      })
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const deleteResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/${input.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!deleteResponse.ok) {
        const error = await deleteResponse.text()
        console.dir(`Ocurrió un problema eliminando un empleado\n ${input}\n con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })

      }
    }),
  getAllAsOptions: publicProcedure
    .query(async () => {

      const employees = await api.employees.getAll.query()

      const employeesAsOptions: EmployeeOption[] = employees?.map(e => {
        return { value: e.id, label: e.nombre }
      })
      return employeesAsOptions

    }),
  checkId: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const employeeResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })
      // console.log(employeeResponse.status)
      if (employeeResponse.status === 404) {
        return true
      }
      if (!employeeResponse.ok) {
        const error = await employeeResponse.text()
        console.log(`Ocurrió un problema verificando si es único el UID (${input.id}) con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }

      return false
    }),
  groups: groupsRouter
});
