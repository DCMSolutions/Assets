import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env";
import { Employee } from "./employees";

export type Group = {
  id: number,
  nombre: string,
}

export const groupsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      const groupsResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!groupsResponse.ok) {
        const error = await groupsResponse.text()
        console.log("Ocurrió un problema al pedir la lista de grupos con el siguiente mensaje de error:", error)
        return
      }
      const groups = await groupsResponse.json()
      console.log(groups)
      return groups

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
        return

      }
      const group = await groupResponse.json()
      console.log(group)
      return group

    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        employeesToAssign: z.array(z.string())
      })
    )
    .mutation(async ({ input }) => {

      const createResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: input.name })
        })

      if (!createResponse.ok) {
        const error = await createResponse.text()
        console.log("Ocurrió un problema al intentar crear un grupo nuevo con el siguiente mensaje de error:", error)
        return
      }
      if (input.employeesToAssign.length === 0) {
        console.log("Se creó un grupo sin ningún empleado asignado")
        return
      }
      const group = await createResponse.json()
      const assignEmployeesResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados/empleados/asignar/${group.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input.employeesToAssign)
        })
      if (!assignEmployeesResponse.ok) {
        const error = await assignEmployeesResponse.text()
        console.log(`Ocurrió un problema al intentar asignar empleados a un grupo recién creado (id: ${group.id}, nombre: ${input.name}) con el siguiente mensaje de error:`, error)
        return
      }
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        nombre: z.string(),
        toAssign: z.array(z.string()),
        toUnassign: z.array(z.string()),
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
            nombre: input.nombre
          })
        })

      if (!editResponse.ok) {
        const error = await editResponse.text()
        console.log(`Ocurrió un problema al intentar editar un grupo (id: ${input.id}, nombre: ${input.nombre}) con el siguiente mensaje de error:`, error)
        return
      }
      if (input.toAssign.length !== 0) {
        const assignmentResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados/empleados/asignar/${input.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input.toAssign)
          })
        if (!assignmentResponse.ok) {
          const error = await assignmentResponse.text()
          console.log(`Ocurrió un problema al asignar empleados editando un grupo (id: ${input.id}, nombre: ${input.nombre}) con el siguiente mensaje de error:`, error)
          return
        }

      }

      if (input.toUnassign.length !== 0) {
        const unassignmentResponse = await fetch(`${env.SERVER_URL}/api/AssetsGrupoEmpleados/empleados/desasignar/${input.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input.toUnassign)
          })
        if (unassignmentResponse.ok) {
          const error = await unassignmentResponse.text()
          console.log(`Ocurrió un problema al desasignar empleados editando un grupo (id: ${input.id}, nombre: ${input.nombre}) con el siguiente mensaje de error:`, error)
          return
        }
      }
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
      console.log(employees)
      return employees

    })
});

