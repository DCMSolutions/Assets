import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env";
import { categoriesRouter } from "./categories";
import { nanoid } from "nanoid";
import { api } from "~/trpc/server";

export type Asset = {
  id: string,
  modelo: string,
  poseedorActual: string | undefined,
  idCategoria: number,
  idEmpleadoAsignado: string | undefined,
  idBoxAsignado: number,
  nroSerieLocker: string,
  estado: AssetState
}

export type AssetExtended = Omit<Asset, "poseedorActual"> & {
  nombrePoseedorActual: string | undefined,
  idPoseedorActual: string | undefined,
  nombreEmpleadoAsignado: string | undefined,
  categoria: string,
}

export const STATES = {
  FUNCIONAL: "Funcional",
  DEFECTUOSO: "Defectuoso",
  MANTENIMIENTO: "Mantenimiento",
  PERDIDO: "Perdido",
  EOL: "EOL",
  ARCHIVADO: "Archivado"
} as const

export type AssetState = typeof STATES[keyof typeof STATES]


export const assetsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      const assetsResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!assetsResponse.ok) {
        const error = await assetsResponse.text()
        console.log("Ocurrió un problema al pedir todos los activos con el siguiente mensaje de error:", error)
      }
      const categories = await api.assets.categories.getAll.query()
      const employees = await api.employees.getAll.query()
      const assets: Asset[] = await assetsResponse.json()
      console.log("Todos los activos actuales:", assets)

      const assetsExtended: AssetExtended[] = assets.map((asset) => {
        const { poseedorActual, idCategoria, idEmpleadoAsignado, ...rest } = asset
        const holderName = employees.find((e) => e.id === poseedorActual)?.nombre
        const ownerName = employees.find((e) => e.id === idEmpleadoAsignado)?.nombre
        const categoryName = categories!.find((c) => c.id === idCategoria.toString())!.nombre
        return {
          idPoseedorActual: poseedorActual,
          nombrePoseedorActual: holderName,
          idEmpleadoAsignado,
          nombreEmpleadoAsignado: ownerName,
          idCategoria,
          categoria: categoryName,
          ...rest
        }
      })
      return assetsExtended

    }),
  getById: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const assetResponse = await fetch(`${env.SERVER_URL}/api/Asset/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!assetResponse.ok) {
        const error = await assetResponse.text()
        console.log(`Ocurrió un problema al intentar pedir un activo (${input.id}) con el siguiente mensaje de error:`, error)
      }
      const asset: Asset = await assetResponse.json()
      console.log(asset)
      return asset

    }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        modelo: z.string(),
        idCategoria: z.number(),
        idEmpleadoAsignado: z.string().nullish(),
        idBoxAsignado: z.number().nullish(),
        nroSerieLocker: z.string().nullish(),
        estado: z.string()
        // estado: z.enum(["Funcional", "Defectuoso", "Mantenimiento", "Perdido", "EOL", "Archivado"])
      })
    )
    .mutation(async ({ input }) => {
      const { estado, ...rest } = input

      const createResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...rest, estado: parseInt(estado) })
        })

      if (!createResponse.ok) {
        const error = createResponse.text()
        console.dir(input)
        console.log(`Ocurrió un problema al intentar crear un activo el siguiente mensaje de error:`, error)
      }
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        modelo: z.string(),
        idCategoria: z.number(),
        idEmpleadoAsignado: z.string().nullish(),
        idBoxAsignado: z.number().nullish(),
        nroSerieLocker: z.string().nullish(),
        estado: z.enum(["Funcional", "Defectuoso", "Mantenimiento", "Perdido", "EOL", "Archivado"])
      })
    )
    .mutation(async ({ input }) => {

      const editResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
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
        console.log(`Ocurrió un problema al intentar editar un activo (${input}) con el siguiente mensaje de error:`, error)
      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const deleteResponse = await fetch(`${env.SERVER_URL}/api/Asset/${input.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!deleteResponse.ok) {
        const error = await deleteResponse.text()
        console.log(`Ocurrió un error al intentar eliminar un activo (id: ${input.id}) con el siguiente mensaje de error:`, error)
      }
    }),
  generateTAG: publicProcedure
    .query(async () => {
      const tag = nanoid()
      return tag
    }),
  getStatesAsOptions: publicProcedure
    .query(() => {
      return Object.values(STATES).map((state, index) => {
        return {
          value: index.toString(),
          label: state
        }
      })
    }),
  getLockersAndBoxes: publicProcedure
    .query(async () => {
      return [
        {
          locker: "LockerA",
          boxes: [1, 2, 3]
        },
        {
          locker: "LockerB",
          boxes: [3, 5]
        }
      ]
      const lockersAndBoxesResponse = await fetch(`${env.SERVER_URL}/api/AssetsGestion/AllBoxesDisp`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })
      if (!lockersAndBoxesResponse.ok) {
        const error = await lockersAndBoxesResponse.text()
        console.log(`Ocurrió un problema al pedir todos los boxes disponibles con el siguiente mensaje de error:`, error)
        return
      }
      const lockersAndBoxes = await lockersAndBoxesResponse.json()
      return lockersAndBoxes
    }),
  categories: categoriesRouter
});
