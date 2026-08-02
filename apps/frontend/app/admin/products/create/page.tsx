"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateProduct } from "@/lib/products";
import { useUploadImage } from "@/lib/upload";

export default function CreateProductPage() {
  const router = useRouter();

  const createProduct =
    useCreateProduct();

  const uploadImage =
    useUploadImage();

  const [form, setForm] = useState({
    name: "",
    tamilName: "",
    description: "",
    pricePerKg: "",
    imageUrl: "",
    category: "",
    stockQuantityGrams: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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
    const file =
      e.target.files?.[0];

    if (!file) return;

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const result =
        await uploadImage.mutateAsync({
          body: formData,
        });

      setForm((prev) => ({
        ...prev,
        imageUrl:
          result.body.imageUrl,
      }));

      alert(
        "Image uploaded successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to upload image"
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!form.imageUrl) {
      alert(
        "Please upload an image"
      );
      return;
    }

    try {
      await createProduct.mutateAsync({
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
        "Product created successfully"
      );

      router.push(
        "/admin/products"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create product"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">
        Create Product
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
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="name"
          placeholder="English Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />

        <input
          type="number"
          name="pricePerKg"
          placeholder="Price Per Kg"
          value={form.pricePerKg}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div className="space-y-2">
          <label className="font-medium block">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageUpload
            }
            className="w-full border p-2 rounded"
          />

          {uploadImage.isPending && (
            <p className="text-blue-600">
              Uploading image...
            </p>
          )}

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-48 h-48 object-cover border rounded"
            />
          )}
        </div>

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="stockQuantityGrams"
          placeholder="Stock Quantity (grams)"
          value={
            form.stockQuantityGrams
          }
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={
            createProduct.isPending ||
            uploadImage.isPending
          }
          className="border px-4 py-2 rounded"
        >
          {createProduct.isPending
            ? "Creating..."
            : "Create Product"}
        </button>
      </form>
    </div>
  );
}