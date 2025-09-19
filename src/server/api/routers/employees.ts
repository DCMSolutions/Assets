import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { EmployeesTableRecord } from "~/app/employees/columns";


const employees: EmployeesTableRecord[] = [
  {
    rfid: "RFID001234",
    firstName: "Ana",
    lastName: "López",
    email: "ana.lopez@example.com",
    active: true
  },
  {
    rfid: "RFID001235",
    firstName: "Bruno",
    lastName: "Fernández",
    email: "bruno.fernandez@example.com",
    active: false
  },
  {
    rfid: "RFID001236",
    firstName: "Carla",
    lastName: "Gómez",
    email: "carla.gomez@example.com",
    active: true
  },
  {
    rfid: "RFID001237",
    firstName: "Diego",
    lastName: "Martínez",
    email: "diego.martinez@example.com",
    active: true
  },
  {
    rfid: "RFID001238",
    firstName: "Elena",
    lastName: "Ramírez",
    email: "elena.ramirez@example.com",
    active: false
  },
  {
    rfid: "RFID001239",
    firstName: "Francisco",
    lastName: "Ortega",
    email: "francisco.ortega@example.com",
    active: true
  },
  {
    rfid: "RFID001240",
    firstName: "Gabriela",
    lastName: "Torres",
    email: "gabriela.torres@example.com",
    active: true
  },
  {
    rfid: "RFID001241",
    firstName: "Hernán",
    lastName: "Vidal",
    email: "hernan.vidal@example.com",
    active: false
  },
  {
    rfid: "RFID001242",
    firstName: "Isabel",
    lastName: "Núñez",
    email: "isabel.nunez@example.com",
    active: true
  },
  {
    rfid: "RFID001243",
    firstName: "Julián",
    lastName: "Peña",
    email: "julian.pena@example.com",
    active: false
  }
];

export const employeesRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      return employees
    }),
  create: protectedProcedure
    .input(
      z.object({
        rfid: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        active: z.boolean()
      })
    )
    .mutation(({ input }) => {

    }),
  edit: protectedProcedure
    .input(
      z.object({
        rfid: z.string(),
        name: z.string(),
        email: z.string(),
        active: z.boolean()
      })
    )
    .mutation(({ input }) => {

    }),
  delete: protectedProcedure
    .input(
      z.object({
        rfid: z.string(),
        name: z.string(),
        email: z.string(),
        active: z.boolean()
      })
    )
    .mutation(({ input }) => {

    }),
});
