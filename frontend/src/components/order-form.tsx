import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Mail, Package, DollarSign, Image as ImageIcon } from "lucide-react";

// Funções de formatação de preço (centavos ↔ R$)
const formatPrice = (cents: number): string => {
  const reais = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(reais);
};

const parsePrice = (formatted: string): number => {
  // Remove tudo exceto números
  const numbers = formatted.replace(/\D/g, "");
  return numbers ? parseInt(numbers, 10) : 0;
};

// Schema alinhado com o backend
const formSchema = z.object({
  customerEmail: z
    .string()
    .min(1, "E-mail is required.")
    .email("Invalid E-mail."),
  productName: z.string().min(2, "Product name must have least 2 characters."),
  productPrice: z
    .string()
    .min(1, "Product Price is required")
    .refine(
      (val) => {
        const cents = parsePrice(val);
        return cents >= 1;
      },
      { message: "Product Price must be Positive" }
    ),
  imageUrl: z
    .string()
    .max(2048, "Product can't have more than 2048 characters.")
    .optional()
    .refine((val) => !val || val === "" || z.url().safeParse(val).success, {
      message: "Please enter a valid URL",
    }),
});

export const OrderForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      customerEmail: "john@example.com",
      productName: "Premium Widget",
      productPrice: formatPrice(9999), // R$ 99,99 em centavos
      imageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Converte o preço formatado (R$) para centavos (número)
      const priceInCents = parsePrice(values.productPrice);

      const response = await fetch(
        "http://localhost:3000/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerEmail: values.customerEmail,
            productName: values.productName,
            productPrice: priceInCents, // Já está em centavos
            imageUrl: values.imageUrl || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const checkoutUrl = await response.text();
      // Redireciona para a URL do checkout do Stripe
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-purple-600">Create</span> Order
          </h1>
          <p className="text-gray-600 text-base">
            Fill in the details to create a new order.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="customerEmail"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              id="customerEmail"
              {...form.register("customerEmail")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                form.formState.errors.customerEmail
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {form.formState.errors.customerEmail && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.customerEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="productName"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <Package className="w-4 h-4" />
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              {...form.register("productName")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                form.formState.errors.productName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {form.formState.errors.productName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.productName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="productPrice"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <DollarSign className="w-4 h-4" />
              Price
            </label>
            <input
              type="text"
              id="productPrice"
              inputMode="numeric"
              {...form.register("productPrice")}
              onChange={(e) => {
                const input = e.target.value;
                // Remove tudo exceto números
                const numbers = input.replace(/\D/g, "");

                if (numbers === "") {
                  form.setValue("productPrice", "");
                  return;
                }

                // Converte para centavos e formata
                const cents = parseInt(numbers, 10);
                const formatted = formatPrice(cents);
                form.setValue("productPrice", formatted, {
                  shouldValidate: true,
                });
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value) {
                  const cents = parsePrice(value);
                  if (cents > 0) {
                    form.setValue("productPrice", formatPrice(cents), {
                      shouldValidate: true,
                    });
                  }
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                form.formState.errors.productPrice
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {form.formState.errors.productPrice && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.productPrice.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <ImageIcon className="w-4 h-4" />
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              {...form.register("imageUrl")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                form.formState.errors.imageUrl
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <p className="text-sm text-gray-500">
              Optional - Add a product image URL
            </p>
            {form.formState.errors.imageUrl && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.imageUrl.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </form>
      </div>
    </div>
  );
};
