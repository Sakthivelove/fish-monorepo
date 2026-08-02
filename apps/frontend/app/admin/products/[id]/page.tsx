"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useProduct,
  useUpdateProduct,
} from "@/lib/products";
import { useUploadImage } from "@/lib/upload";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data, isLoading } =
    useProduct(id);

  const updateProduct =
    useUpdateProduct();

  const uploadImage =
    useUploadImage();

  const product = data?.body;

  const [form, setForm] = useState({
    name: "",
    tamilName: "",
    description: "",
    pricePerKg: "",
    imageUrl: "",
    category: "",
    stockQuantityGrams: "",
  });

  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name ?? "",
      tamilName: product.tamilName,
      description:
        product.description ?? "",
      pricePerKg: String(
        product.pricePerKg
      ),
      imageUrl: product.imageUrl,
      category: product.category,
      stockQuantityGrams: String(
        product.stockQuantityGrams
      ),
    });
  }, [product]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response =
        await uploadImage.mutateAsync({
          body: formData,
        });

      setForm((prev) => ({
        ...prev,
        imageUrl:
          response.body.imageUrl,
      }));
    } catch (error) {
      console.error(error);

      alert("Image upload failed");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await updateProduct.mutateAsync({
        params: {
          id,
        },

        body: {
          name:
            form.name.trim() || null,
          tamilName:
            form.tamilName,
          description:
            form.description,
          pricePerKg: Number(
            form.pricePerKg
          ),
          imageUrl:
            form.imageUrl,
          category:
            form.category,
          stockQuantityGrams:
            Number(
              form.stockQuantityGrams
            ),
        },
      });

      alert(
        "Product updated successfully"
      );

      router.push(
        "/admin/products"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update product"
      );
    }
  };

  if (isLoading) {
    return (
      <div>Loading product...</div>
    );
  }

  if (!product) {
    return (
      <div>Product not found</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="tamilName"
          placeholder="Tamil Name"
          value={form.tamilName}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          name="name"
          placeholder="English Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2"
          rows={4}
        />

        <input
          type="number"
          name="pricePerKg"
          value={form.pricePerKg}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <div>
          <label className="block mb-2">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2"
          />
        </div>

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="w-full max-w-xs h-auto object-cover border rounded"
          />
        )}

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          type="number"
          name="stockQuantityGrams"
          value={
            form.stockQuantityGrams
          }
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <button
          type="submit"
          disabled={
            updateProduct.isPending ||
            uploadImage.isPending
          }
          className="border px-4 py-2 rounded"
        >
          {
            uploadImage.isPending
              ? "Uploading Image..."
              : updateProduct.isPending
                ? "Saving..."
                : "Save Changes"
          }
        </button>
      </form>
    </div>
  );
}