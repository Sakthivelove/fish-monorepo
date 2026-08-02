"use client";

import { CreateOrderInputSchema } from "@/data/schemas";
import { useCreateOrder } from "@/lib/orders";
import { useProducts } from "@/lib/products";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

type CreateOrderFormInputs = z.infer<typeof CreateOrderInputSchema>;

export default function CreateOrderForm() {
  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts();

  const createOrder = useCreateOrder();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOrderFormInputs>({
    resolver: zodResolver(CreateOrderInputSchema),
    defaultValues: {
      customer: {
        name: "",
        phoneNumber: "",
        email: "",
      },
      deliveryAddress: "",
      pincode: "",
      paymentMethod: "COD",

      transactionId: null,
      
      items: [
        {
          productId: "",
          quantityGrams: 500,
          cuttingOption: "CURRY_CUT",
        },
      ],
    },
  });

  const products = productsData?.body ?? [];

  const onSubmit = async (data: CreateOrderFormInputs) => {
    setStatusMessage(null);
    setSubmitting(true);

    try {
      const response = await createOrder.mutateAsync({ body: data });
      setStatusMessage(`✅ ஆர்டர் வெற்றிகரமாக அனுப்பப்பட்டது! Order ID: ${response.body.id}`);
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "ஏதோ தவறு ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.";
      setStatusMessage(`❌ ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-600">
        ஆர்டரைச் செய்யவும்
      </h2>

      {statusMessage && (
        <p
          className={`p-3 mb-4 rounded ${statusMessage.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {statusMessage}
        </p>
      )}

      <fieldset className="border p-4 rounded mb-6 bg-yellow-50">
        <legend className="text-lg font-semibold text-blue-800 px-1">
          ஆர்டர் செய்யும் பொருள்
        </legend>

        {isProductsLoading ? (
          <p className="text-gray-600">பொருட்களை ஏற்றுகிறது...</p>
        ) : productsError ? (
          <p className="text-red-500">
            பொருட்களைப் பெற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.
          </p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">இன்று ஒரு தயாரிப்பும் இல்லை.</p>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                தயாரிப்பு
              </label>
              <select
                id="product"
                {...register("items.0.productId")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">-- ஒரு தயாரிப்பைத் தேர்ந்தெடுக்கவும் --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.tamilName} - ₹{product.pricePerKg.toFixed(2)}/kg
                  </option>
                ))}
              </select>
              {errors.items?.[0]?.productId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.items[0].productId?.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 w-1/3">
                தேவைப்படும் அளவு (கிராம்)
              </label>
              <input
                id="quantity"
                type="number"
                min="250"
                step="50"
                {...register("items.0.quantityGrams", { valueAsNumber: true })}
                className="mt-1 block w-2/3 border border-gray-300 rounded-md shadow-sm p-2"
              />
              <p className="text-gray-500 text-xs mt-1">
                250-ஐத் தொடங்கி 50 கிராம் அடுக்குகளில் மதிப்புகளை உள்ளிடவும்.
              </p>
              {errors.items?.[0]?.quantityGrams && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.items[0].quantityGrams?.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="cutting" className="block text-sm font-medium text-gray-700 w-1/3">
                வெட்டுதல் விருப்பம்
              </label>
              <select
                id="cutting"
                {...register("items.0.cuttingOption")}
                className="mt-1 block w-2/3 border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="WHOLE">முழு மீன் (Whole)</option>
                <option value="CURRY_CUT">கறி வெட்டு (Curry Cut)</option>
                <option value="FILLET">சதை (Fillet)</option>
              </select>
              {errors.items?.[0]?.cuttingOption && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.items[0].cuttingOption?.message}
                </p>
              )}
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="border p-4 rounded mb-6">
        <legend className="text-lg font-semibold text-blue-800 px-1">
          உங்கள் விவரங்கள்
        </legend>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            பெயர்
          </label>
          <input
            id="name"
            type="text"
            {...register("customer.name")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.customer?.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customer.name.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            தொலைபேசி எண்
          </label>
          <input
            id="phone"
            type="tel"
            {...register("customer.phoneNumber")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.customer?.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customer.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            மின்னஞ்சல் (விரும்பினால்)
          </label>
          <input
            id="email"
            type="email"
            {...register("customer.email")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.customer?.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customer.email.message}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="border p-4 rounded mb-6">
        <legend className="text-lg font-semibold text-blue-800 px-1">
          டெலிவரி முகவரி
        </legend>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            முகவரி
          </label>
          <textarea
            id="address"
            rows={3}
            {...register("deliveryAddress")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.deliveryAddress && (
            <p className="text-red-500 text-xs mt-1">
              {errors.deliveryAddress.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
            பின்கோடு
          </label>
          <input
            id="pincode"
            type="text"
            {...register("pincode")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.pincode && (
            <p className="text-red-500 text-xs mt-1">
              {errors.pincode.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-blue-800 mb-2">
          கட்டண முறை
        </label>
        <select
          {...register("paymentMethod")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="COD">பணம் செலுத்தும் போது பணம் (Cash on Delivery - COD)</option>
          <option value="UPI">UPI (Google Pay/PhonePe)</option>
          {/* <option value="CARD">அட்டை (Card)</option> */}
        </select>
        {errors.paymentMethod && (
          <p className="text-red-500 text-xs mt-1">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || isProductsLoading}
        className="w-full bg-green-500 text-white py-3 rounded-md font-semibold text-lg hover:bg-green-600 transition duration-300 disabled:bg-gray-400"
      >
        {submitting ? "ஆர்டர் அனுப்பப்படுகிறது..." : "ஆர்டரை உறுதிப்படுத்துக"}
      </button>
    </form>
  );
}
