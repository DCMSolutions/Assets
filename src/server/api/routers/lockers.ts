import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { db, schema } from "~/server/db";
import { and, eq } from "drizzle-orm";


const boxSchema = z.object({
  idFisico: z.number().int().nonnegative(),
  puerta: z.boolean(),
  ocupacion: z.boolean(),
  size: z.enum(["S", "M", "L"])
}).strict();

/**
 * Esquema principal del locker
 */
export const lockerSchema = z.object({
  nroSerieLocker: z.string(),
  status: z.string(),
  estadoCerraduras: z.string(),
  boxes: z.array(boxSchema)
}).strict();

const lockerListSchema = z.array(lockerSchema)

export type Box = z.infer<typeof boxSchema>;
export type Locker = z.infer<typeof lockerSchema>;

async function getLockers() {
  const lockersResponse = await fetch(`${env.SERVER_URL}/api/AssetsGestion/LockersMonitor`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
      }
    })

  if (!lockersResponse.ok) {
    const error = await lockersResponse.text()
    console.log("Ocurrió un problema al pedir todos los activos con el siguiente mensaje de error:", error)
  }
  const lockers: Locker[] = await lockersResponse.json()

  // const validatedLockers = lockerListSchema.safeParse(lockers)
  return lockers

}

export const lockerRouter = createTRPCRouter({
  getForMonitor: publicProcedure.query(async () => {
    const lockers = await getLockers()
    return lockers

  }),
});
