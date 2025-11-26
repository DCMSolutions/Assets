import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "~/env";
import { api } from "~/trpc/server";

export type CategoryRaw = {
  id: number,
  nombre: string,
}

export type Category = {
  id: string,
  nombre: string,
}

export type CategoryOption = {
  value: string,
  label: string,
}

export async function getAllCategories() {

  const categoriesResponse = await fetch(`${env.SERVER_URL}/api/AssetsCategoria`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
      }
    })

  if (!categoriesResponse.ok) {
    const error = await categoriesResponse.text()
    console.log("Ocurrió un problema al pedir la lista de categorías con el siguiente mensaje de error:", error)
    return
  }
  const categories: CategoryRaw[] = await categoriesResponse.json()
  const categoriesToReturn: Category[] = categories?.map((category) => {
    return {
      id: category.id.toString(),
      nombre: category.nombre
    }
  })
  // console.log(categoriesToReturn)
  return categoriesToReturn
}

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {
      return await getAllCategories()

    }),
  getById: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .query(async ({ input }) => {
      const categoryResponse = await fetch(`${env.SERVER_URL}/api/AssetsCategoria/${input.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!categoryResponse.ok) {
        const error = await categoryResponse.text()
        console.log(`Ocurrió un problema al pedir una categoría (id: ${input.id}) con el siguiente mensaje de error:`, error)
        return
      }
      const category: CategoryRaw = await categoryResponse.json()
      // console.log(category)

      const categoryToReturn: Category = {
        id: category.id.toString(),
        nombre: category.nombre
      }
      return categoryToReturn

    }),
  create: publicProcedure
    .input(
      z.object({
        nombre: z.string()
      })
    )
    .mutation(async ({ input }) => {

      const createResponse = await fetch(`${env.SERVER_URL}/api/AssetsCategoria`,
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
        console.log("Ocurrió un problema al intentar crear una categoría nuevo con el siguiente mensaje de error:", error)
        return
      }
      const category: CategoryRaw = await createResponse.json()
      return { id: category.id.toString(), nombre: category.nombre }
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        nombre: z.string(),
      })
    )
    .mutation(async ({ input }) => {

      const editResponse = await fetch(`${env.SERVER_URL}/api/AssetsCategoria`,
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
        console.log(`Ocurrió un problema al intentar editar una categoría (id: ${input.id}, nombre: ${input.nombre}) con el siguiente mensaje de error:`, error)
        return
      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const deleteResponse = await fetch(`${env.SERVER_URL}/api/AssetsCategoria/${input.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${env.TOKEN_EMPRESA}`,
          }
        })

      if (!deleteResponse.ok) {
        const error = await deleteResponse.text()
        console.log(`Ocurrió un problema al intentar eliminar una categoría (id: ${input.id}) con el siguiente mensaje de error:`, error)
        return
      }
    }),
  getAllAsOptions: publicProcedure
    .query(async () => {
      const categories = await api.assets.categories.getAll.query()

      const categoriesAsOptions: CategoryOption[] = categories!.map(c => {
        return {
          value: c.id,
          label: c.nombre
        }
      })
      return categoriesAsOptions

    }),
});
