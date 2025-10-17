import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { groupsRouter } from "./groups";
import { env } from "~/env";
import { api } from "~/trpc/server";
import { TRPCError } from "@trpc/server";
import { ERROR_MESSAGES } from "~/lib/errors";

type EmployeeRaw = {
  id: string,
  nombre: string,
  mail: string | null,
  habilitado: boolean,
  assetsAsignados: string[],
  categoriasAssetsAsignadas: number[],
  gruposAsignados: number[]
}

export type Employee = EmployeeRaw

export type EmployeeForTable = Omit<EmployeeRaw, "assetsAsignados" | "categoriasAssetsAsignadas" | "gruposAsignados">

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
      console.log(employees)
      return employees

    }),
  getAllForTable: publicProcedure
    .query(async () => {
      const allEmployees = await api.employees.getAll.query()
      const employeesForTable: EmployeeForTable[] = allEmployees.map(e => {
        return {
          id: e.id,
          nombre: e.nombre,
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
      console.log(employee)
      return employee

    }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string(),
        mail: z.string().nullish(),
        habilitado: z.boolean()
      })
    )
    .mutation(async ({ input }) => {
      const createResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input)
        })

      if (!createResponse.ok) {
        const error = await createResponse.text()
        console.dir(`Ocurrió un problema creando un empleado\n ${input}\n con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })

      }
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string(),
        mail: z.string().nullish(),
        habilitado: z.boolean()
      })
    )
    .mutation(async ({ input }) => {

      const editResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input)
        })

      if (!editResponse.ok) {
        const error = await editResponse.text()
        console.dir(`Ocurrió un problema editando un empleado\n ${input}\n con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })

      }
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
  groups: groupsRouter
});
