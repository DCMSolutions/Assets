import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { RouterOutputs } from "~/trpc/shared";
import { publicDecrypt } from "crypto";
import { groupsRouter } from "./groups";
import { env } from "~/env";


// const employees = [
//   {
//     id: "id001234",
//     firstName: "Ana",
//     lastName: "López",
//     email: "ana.lopez@example.com",
//     active: true
//   },
//   {
//     id: "id001235",
//     firstName: "Bruno",
//     lastName: "Fernández",
//     email: "bruno.fernandez@example.com",
//     active: false
//   },
//   {
//     id: "id001236",
//     firstName: "Carla",
//     lastName: "Gómez",
//     email: "carla.gomez@example.com",
//     active: true
//   },
//   {
//     id: "id001237",
//     firstName: "Diego",
//     lastName: "Martínez",
//     email: "diego.martinez@example.com",
//     active: true
//   },
//   {
//     id: "id001238",
//     firstName: "Elena",
//     lastName: "Ramírez",
//     email: "elena.ramirez@example.com",
//     active: false
//   },
//   {
//     id: "id001239",
//     firstName: "Francisco",
//     lastName: "Ortega",
//     email: "francisco.ortega@example.com",
//     active: true
//   },
//   {
//     id: "id001240",
//     firstName: "Gabriela",
//     lastName: "Torres",
//     email: "gabriela.torres@example.com",
//     active: true
//   },
//   {
//     id: "id001241",
//     firstName: "Hernán",
//     lastName: "Vidal",
//     email: "hernan.vidal@example.com",
//     active: false
//   },
//   {
//     id: "id001242",
//     firstName: "Isabel",
//     lastName: "Núñez",
//     email: "isabel.nunez@example.com",
//     active: true
//   },
//   {
//     id: "id001243",
//     firstName: "Julián",
//     lastName: "Peña",
//     email: "julian.pena@example.com",
//     active: false
//   }
// ];

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

      }
      const employees = await employeesResponse.json()
      console.log(employees)
      return employees

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

      }
      const employee = await employeeResponse.json()
      console.log(employee)
      return employee

    }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string()
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

      }
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string(),
        // email: z.string(),
        // active: z.boolean()
      })
    )
    .mutation(async ({ input }) => {

      const createResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input)
        })

      if (!createResponse.ok) {

      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const employeeResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/${input.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!employeeResponse.ok) {

      }
    }),
  groups: groupsRouter
});

export type Employee = RouterOutputs["employees"]["getById"]
