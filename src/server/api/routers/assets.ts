import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env";
import { categoriesRouter } from "./categories";
import { nanoid } from "nanoid";
import { api } from "~/trpc/server";

export type AssetRaw = {
  id: string,
  modelo: string,
  poseedorActual: string | undefined,
  idCategoria: number,
  categoria: string,
  idEmpleadoAsignado: string | undefined,
  empleadoAsignado: string | undefined,
  idBoxAsignado: number | undefined,
  nroSerieLocker: string | undefined,
  estado: number
}

export type Asset = Omit<AssetRaw, "idCategoria" | "idBoxAsignado" | "estado"> & {
  idCategoria: string,
  idBoxAsignado: string | undefined,
  estado: string
}

export type AssetForTable = Omit<AssetRaw, "poseedorActual" | "estado"> & {
  nombrePoseedorActual: string | undefined,
  idPoseedorActual: string | undefined,
  nombreEmpleadoAsignado: string | undefined,
  categoria: string,
  estado: AssetState
}

export const STATES = [
  "Funcional",
  "Defectuoso",
  "Mantenimiento",
  "Perdido",
  "EOL",
  "Archivado"
]

export type AssetState = typeof STATES[keyof typeof STATES]

export type AssetEventRaw = {
  id: number;
  idAsset: string;
  idEmpleado: string;
  nroSerieLocker: string;
  evento: number;
  estadoPrevio: number;
  estadoNuevo: number | null;
  fechaEvento: string;
  asset: AssetRaw;
  assetsEmpleado: any | null;
}

export type AssetEventForTable = Omit<AssetEventRaw, "evento"> & { evento: string }

export const EVENTS = [
  "Alta",
  "Ingreso",
  "Retiro",
  "Asignación a Empleado",
  "Asignación a Grupo",
  "Cambio de Estado"
]

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
      const assets: AssetRaw[] = await assetsResponse.json()
      // console.log("Todos los activos actuales:", assets)
      return assets

    }),
  getAllForTable: publicProcedure
    .query(async () => {

      const assets = await api.assets.getAll.query()
      const categories = await api.assets.categories.getAll.query()
      const employees = await api.employees.getAll.query()

      const assetsExtended: AssetForTable[] = assets.map((asset) => {
        const { poseedorActual, idCategoria, idEmpleadoAsignado, estado, ...rest } = asset
        const holderName = employees.find((e) => e.id === poseedorActual)?.nombre
        const ownerName = employees.find((e) => e.id === idEmpleadoAsignado)?.nombre
        const categoryName = categories!.find((c) => c.id === idCategoria.toString())!.nombre
        const obj = {
          ...rest,
          idPoseedorActual: poseedorActual,
          nombrePoseedorActual: holderName,
          idEmpleadoAsignado,
          nombreEmpleadoAsignado: ownerName,
          idCategoria,
          estado: STATES[estado]!,
          categoria: categoryName,
        }
        return obj
      })
      // console.log(assetsExtended)
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
      const rawAsset: AssetRaw = await assetResponse.json()
      // console.log(rawAsset)

      const { idCategoria, idBoxAsignado, nroSerieLocker, estado, ...rest } = rawAsset
      const locker = nroSerieLocker ?? ""
      const box = idBoxAsignado
        ? idBoxAsignado.toString()
        : ""
      const asset: Asset = {
        idCategoria: idCategoria.toString(),
        nroSerieLocker: locker,
        idBoxAsignado: box,
        estado: estado.toString(),
        ...rest
      }
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
        estado: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const createResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input)
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
        estado: z.number()
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

      if (input.idEmpleadoAsignado) {
        const assignmentResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/assignAsset/${input.idEmpleadoAsignado}/${input.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            },
          })
        if (!assignmentResponse.ok) {
          const error = await assignmentResponse.text()
          console.log(`Ocurrió un error asignándole un activo a un empleado al editar el activo ${input.id} con el siguiente mensaje de error:`, error)
        }
      } else {
        const assignmentResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/unassignAsset/${input.idEmpleadoAsignado}/${input.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            },
          })
        if (!assignmentResponse.ok) {
          const error = await assignmentResponse.text()
          console.log(`Ocurrió un error desasignándole un activo a un empleado al editar el activo ${input.id} con el siguiente mensaje de error:`, error)
        }
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
      console.dir(lockersAndBoxes)
      return lockersAndBoxes
    }),
  history: publicProcedure
    .query(async () => {
      const historyResponse = await fetch(`${env.SERVER_URL}/api/AssetsHistorial`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })
      if (!historyResponse.ok) {
        const error = await historyResponse.text()
        console.log("Ocurrió un problema al pedir el historial de eventos de los activos con el siguiente mensaje de error:", error)
      }
      const history: AssetEventRaw[] = await historyResponse.json()

      const historyForTable: AssetEventForTable[] = history.map(event => {
        const { evento, ...rest } = event
        return {
          evento: EVENTS[evento]!,
          ...rest
        }
      })
      return historyForTable
    }),
  categories: categoriesRouter
});
