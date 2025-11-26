import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env";
import { categoriesRouter, getAllCategories } from "./categories";
import { nanoid } from "nanoid";
import { EmployeeRaw, getAllEmployees } from "./employees";
import { TRPCError } from "@trpc/server";
import { ERROR_MESSAGES } from "~/lib/errors";

export type AssetRaw = {
  id: string,
  numeroDeSerie: string | undefined,
  idMarca: number | undefined,
  modelo: string,
  poseedorActual: string | undefined,
  idCategoria: number,
  categoria: string,
  idEmpleadoAsignado: string | undefined,
  empleadoAsignado: string | undefined,
  idBoxAsignado: number | undefined,
  nroSerieLocker: string | undefined,
  estado: number,
  habilitado: boolean
}

export type AssetWithEmployeesAndGroupsRaw = {
  asset: AssetRaw,
  empleados: string[],
  grupos: number[]
}

export type AssetWithEmployeesAndGroups = {
  asset: Asset,
  employees: string[],
  groups: string[]
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
  assetsEmpleado: EmployeeRaw | null;
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

async function getAssets() {
  const assetsResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
      },
      cache: "no-store"
    })

  if (!assetsResponse.ok) {
    const error = await assetsResponse.text()
    console.log("Ocurrió un problema al pedir todos los activos con el siguiente mensaje de error:", error)
  }
  const assets: AssetRaw[] = await assetsResponse.json()
  // console.log("Todos los activos actuales:", assets)
  return assets

}

async function assignAssetToEmployeeGroups({
  assetId,
  groupIds,
  assign
}: { assetId: string, groupIds: number[], assign: boolean }) {
  if (groupIds.length === 0) return
  console.log(`ENTRÓ A LA FUNCIÓN DE ${assign ? "ASIGNAR" : "DESASIGNAR"}`)

  const baseURL = `${env.SERVER_URL}/api/AssetsGrupoEmpleados/assetsGrupo/${assign ? "asignar" : "desasignar"}`
  for (const groupId of groupIds) {
    const endpoint = `${baseURL}/${groupId}`
    console.log(`Antes de intentar ${assign ? "asignar" : "desasignar"} el asset ${assetId} al grupo ${groupId}`)
    const assignmentResponse = await fetch(endpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([assetId]),
        cache: "no-store"
      })
    console.log(`Intentó ${assign ? "asignar" : "desasignar"} el asset ${assetId} al grupo ${groupId}`)
    if (!assignmentResponse.ok) {
      const error = await assignmentResponse.text()
      console.log(`Ocurrió un problema al ${assign ? "asignar" : "desasignar"} el activo (tag: ${assetId}) al grupo (id: ${groupId}) con el siguiente mensaje de error:`, error)
      return
    }
    console.log(`Se ${assign ? "asignó" : "desasignó"} correctamente el activo (tag: ${assetId}) al grupo (id: ${groupId}).`)
  }

}

export const assetsRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {

      const assets = await getAssets()

      return assets

    }),
  getAllAsOptions: publicProcedure
    .query(async () => {

      const assets = await getAssets()

      const assetsAsOptions = assets.map(asset => {
        const { id } = asset
        return { value: id, label: id }
      })

      return assetsAsOptions
    }),
  getAllForTable: publicProcedure
    .query(async () => {

      const assets = await getAssets()
      const categories = await getAllCategories()
      const employees = await getAllEmployees()

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
          },
          cache: "no-store"
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
  getByIdWithEmployeesAndGroups: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const assetResponse = await fetch(`${env.SERVER_URL}/api/Asset/conEmpleados/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          },
          cache: "no-store"
        })

      if (!assetResponse.ok) {
        const error = await assetResponse.text()
        console.log(`Ocurrió un problema al intentar pedir un activo (${input.id}) con el siguiente mensaje de error:`, error)
      }
      const rawAssetWEG: AssetWithEmployeesAndGroupsRaw = await assetResponse.json()
      // console.log(rawAsset)
      const { asset, empleados, grupos } = rawAssetWEG
      const groups = grupos.map(g => g.toString())
      const { idCategoria, idBoxAsignado, nroSerieLocker, estado, ...rest } = asset
      const locker = nroSerieLocker ?? ""
      const box = idBoxAsignado
        ? idBoxAsignado.toString()
        : ""
      const assetToReturn: Asset = {
        idCategoria: idCategoria.toString(),
        nroSerieLocker: locker,
        idBoxAsignado: box,
        estado: estado.toString(),
        ...rest
      }
      return {
        asset: assetToReturn,
        employees: empleados,
        groups: groups
      } as AssetWithEmployeesAndGroups

    }),
  create: publicProcedure
    .input(
      z.object({
        id: z.string(),
        numeroDeSerie: z.string(),
        idMarca: z.number().nullish(),
        modelo: z.string(),
        idCategoria: z.number(),
        idEmpleadoAsignado: z.string().nullish(),
        idBoxAsignado: z.number().nullish(),
        nroSerieLocker: z.string().nullish(),
        estado: z.number(),
        habilitado: z.boolean(),
        groupsToAssign: z.array(z.number())
      })
    )
    .mutation(async ({ input }) => {
      const { groupsToAssign, ...asset } = input
      const createResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(asset)
        })

      if (!createResponse.ok) {
        const error = createResponse.text()
        console.dir(asset)
        console.log(`Ocurrió un problema al intentar crear un activo el siguiente mensaje de error:`, error)
        return
      }
      assignAssetToEmployeeGroups({ assetId: asset.id, groupIds: groupsToAssign, assign: true })
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        numeroDeSerie: z.string(),
        idMarca: z.number().nullish(),
        modelo: z.string(),
        idCategoria: z.number(),
        idEmpleadoAsignado: z.string().nullish(),
        idBoxAsignado: z.number().nullish(),
        nroSerieLocker: z.string().nullish(),
        estado: z.number(),
        habilitado: z.boolean(),
        groupsToAssign: z.array(z.number()),
        groupsToUnassign: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {

      const { groupsToAssign, groupsToUnassign, ...asset } = input
      const editResponse = await fetch(`${env.SERVER_URL}/api/Asset`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(asset)
        })

      if (!editResponse.ok) {
        const error = await editResponse.text()
        console.log(`Ocurrió un problema al intentar editar un activo (tag: ${asset.id}) con el siguiente mensaje de error:`, error)
        return
      }
      console.log("ANTES DE ASIGNAR GRUPOS")
      await assignAssetToEmployeeGroups({ assetId: asset.id, groupIds: groupsToAssign, assign: true })
      await assignAssetToEmployeeGroups({ assetId: asset.id, groupIds: groupsToUnassign, assign: false })
      console.log("DESPUÉS DE ASIGNAR GRUPOS")
    }),
  assignToEmployee: publicProcedure
    .input(z.object({
      asset: z.string(),
      employee: z.string()
    }))
    .mutation(async ({ input }) => {
      const assignmentResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/assignAsset/${input.employee}/${input.asset}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          },
        })
      if (!assignmentResponse.ok) {
        const error = await assignmentResponse.text()
        console.log(`Ocurrió un error asignándole un activo (${input.asset}) a un empleado (${input.employee}) con el siguiente mensaje de error:`, error)
      }

    }),
  unassignToEmployee: publicProcedure
    .input(z.object({
      asset: z.string(),
      employee: z.string()
    }))
    .mutation(async ({ input }) => {
      const unassignmentResponse = await fetch(`${env.SERVER_URL}/api/AssetsEmpleado/unassignAsset/${input.employee}/${input.asset}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          },
        })
      if (!unassignmentResponse.ok) {
        const error = await unassignmentResponse.text()
        console.log(`Ocurrió un error desasignándole un activo (${input.asset}) a un empleado (${input.employee}) con el siguiente mensaje de error:`, error)
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
          },
          cache: "no-store"
        })
      if (!lockersAndBoxesResponse.ok) {
        const error = await lockersAndBoxesResponse.text()
        console.log(`Ocurrió un problema al pedir todos los boxes disponibles con el siguiente mensaje de error:`, error)
        return
      }
      const lockersAndBoxes = await lockersAndBoxesResponse.json()
      // console.dir(lockersAndBoxes)
      return lockersAndBoxes
    }),
  checkId: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ input }) => {
      const assetResponse = await fetch(`${env.SERVER_URL}/api/Asset/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          },
          cache: "no-store"
        })

      if (assetResponse.status === 404) {
        return true
      }

      if (!assetResponse.ok) {
        const error = await assetResponse.text()
        console.log(`Ocurrió un problema al intentar pedir un activo (${input.id}) con el siguiente mensaje de error:`, error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: ERROR_MESSAGES.GENERIC_INTERNAL_ERROR
        })
      }

      return false

    }),
  history: publicProcedure
    .query(async () => {
      const historyResponse = await fetch(`${env.SERVER_URL}/api/AssetsHistorial`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          },
          cache: "no-store"
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
