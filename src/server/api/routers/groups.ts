import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export type Group = {
  id: number,
  nombre: string,
}

export const groupsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      return employees
    }),
  getById: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {
      const employee = employees.find(e => e.id === input.id)
      return employee
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string()
      })
    )
    .mutation(({ input }) => {
      employees.unshift(input)
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string()
      })
    )
    .mutation(({ input }) => {
      const employeeToEditIndex = employees.findIndex(e => e.id === input.id)
      if (employeeToEditIndex !== -1) {
        employees.splice(employeeToEditIndex, 1, input)
      }

    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input }) => {
      const employeeToEditIndex = employees.findIndex(e => e.id === input.id)
      if (employeeToEditIndex !== -1) {
        employees.splice(employeeToEditIndex, 1)
      }
    }),
});

