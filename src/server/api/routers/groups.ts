import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env";
import { Employee, EmployeeOption } from "./employees";
import { TRPCError } from "@trpc/server";
import { ERROR_MESSAGES } from "~/lib/errors";
import { api } from "~/trpc/server";

export type GroupRaw = {
  id: number,
  nombre: string,
  descripcion: string | null,
  esMantenimiento: boolean,
  esAdministrador: boolean,
  assetsAsignados: string[],
  categoriasAssetsAsignadas: string[],
  empleadosAsignados: string[]
}

export type Group = Omit<GroupRaw, "id"> & { id: string }

export type GroupForTable = {
  id: string,
  nombre: string,
  esMantenimiento: boolean,
  esAdministrador: boolean,
}

export type GroupOption = {
  value: string,
  label: string,
}

export async function getEmployeeGroups() {
  const groupsResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
      }
    })

  if (!groupsResponse.ok) {
    const error = await groupsResponse.text()
    console.log("Ocurrió un problema pidiendo la lista completa de grupos de empleados con el siguiente mensaje de error:", error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
    })
  }
  const rawGroups: GroupRaw[] = await groupsResponse.json()
  return rawGroups
}

export async function assignEmployeesToGroup({
  employees,
  groupId,
  assign
}: { employees: string[], groupId: number, assign: boolean }) {
  if (employees.length === 0) return

  const endpoint = `${env.SERVER_URL}/api/AssetsGrupoEmpleados/empleados/${assign ? "asignar" : "desasignar"}/${groupId}`
  const assignmentResponse = await fetch(endpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employees)
    })
  if (!assignmentResponse.ok) {
    const error = await assignmentResponse.text()
    console.log(`Ocurrió un problema al ${assign ? "asignar" : "desasignar"} empleados a un grupo (id: ${groupId}) con el siguiente mensaje de error:`, error)
    return
  }
}

export const groupsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      const rawGroups = await getEmployeeGroups()
      const groups: Group[] = rawGroups.map(g => {
        const { id, ...rest } = g
        return {
          id: id.toString(),
          ...rest
        }
      })
      // console.log(groups)
      return groups

    }),
  getAllAsOptions: publicProcedure
    .query(async () => {
      const groups = await getEmployeeGroups()
      const groupsAsOptions = groups.map(group => {
        const { id, nombre } = group
        return {
          value: id.toString(),
          label: nombre
        } as GroupOption
      })
      // console.log(groupsAsOptions)
      return groupsAsOptions
    }),
  getAllForTable: publicProcedure
    .query(async () => {
      const groups = await api.employees.groups.getAll.query()

      const groupsForTable: GroupForTable[] = groups.map(g => {
        const {
          categoriasAssetsAsignadas,
          empleadosAsignados,
          descripcion,
          assetsAsignados,
          ...rest
        } = g
        return {
          ...rest
        }
      })

      return groupsForTable
    }),
  getById: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {
      const groupResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!groupResponse.ok) {
        const error = await groupResponse.text()
        console.log(`Ocurrió un problema al pedir un grupo (id: ${input.id}) con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })

      }
      const rawGroup: GroupRaw = await groupResponse.json()
      const { id, ...rest } = rawGroup
      const group: Group = { id: id.toString(), ...rest }

      // console.log(group)
      return group

    }),
  create: publicProcedure
    .input(
      z.object({
        nombre: z.string(),
        esAdministrador: z.boolean(),
        esMantenimiento: z.boolean(),
        employeesToAssign: z.array(z.string())
      })
    )
    .mutation(async ({ input }) => {

      const { employeesToAssign, ...grupo } = input
      const createResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(grupo)
        })

      if (!createResponse.ok) {
        const error = await createResponse.text()
        console.log("Ocurrió un problema al intentar crear un grupo nuevo con el siguiente mensaje de error:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }
      const group = await createResponse.json()
      assignEmployeesToGroup({ employees: input.employeesToAssign, groupId: group.id, assign: true })
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        nombre: z.string(),
        toAssign: z.array(z.string()),
        toUnassign: z.array(z.string()),
        admin: z.boolean(),
        mantenimiento: z.boolean()
      })
    )
    .mutation(async ({ input }) => {

      const editResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: input.id,
            nombre: input.nombre,
            esAdministrador: input.admin,
            esMantenimiento: input.mantenimiento
          })
        })

      if (!editResponse.ok) {
        const error = await editResponse.text()
        console.log(`Ocurrió un problema al intentar editar un grupo (id: ${input.id}, nombre: ${input.nombre}) con el siguiente mensaje de error:`, error)
        return
      }
      assignEmployeesToGroup({ employees: input.toAssign, groupId: input.id, assign: true })
      assignEmployeesToGroup({ employees: input.toUnassign, groupId: input.id, assign: false })
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const deleteResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados/${input.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!deleteResponse.ok) {
        const error = await deleteResponse.text()
        console.log(`Ocurrió un problema al intentar eliminar un grupo (id: ${input.id}) con el siguiente mensaje de error:`, error)
        return
      }
    }),
  getEmployees: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {

      const employeesResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados/empleados/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!employeesResponse.ok) {
        const error = await employeesResponse.text()
        console.log(`Ocurrió un problema al pedir los empleados de un grupo (id: ${input.id}) con el siguiente mensaje de error:`, error)
        return

      }
      const employees: Employee[] = await employeesResponse.json()
      // console.log(employees)
      return employees

    })
});

