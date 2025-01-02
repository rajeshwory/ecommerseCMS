"use server";

import { z } from "zod";
import db from "../../../db/db";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";

// const fileSchema = z.instanceof(File, {message: "Required"})
// const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: z.object({
    size: z.number().min(1, "Required"),
    type: z.string().min(1, "Required"),
  }),
  image: z.object({
    size: z.number().min(1, "Required"),
    type: z.string().min(1, "Required"),
  }),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const entries = Object.fromEntries(formData.entries());
  const result = addSchema.safeParse(entries);
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data

  const file = formData.get("file");
  const image = formData.get("image");

  if (!(file instanceof Blob) || !(image instanceof Blob)) {
    throw new Error("File or image is not a valid File object");
  }

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${file.name}`;
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await image.arrayBuffer())
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description as string,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({where: {id}, data:{isAvailableForPurchase}})
}

export async function deleteProduct(id: string){
  const product = await db.product.delete({where: {id}})
  if (product == null) return notFound()
}
