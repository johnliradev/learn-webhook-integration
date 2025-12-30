import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Package,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const formSchema = z.object({
  customerName: z
    .string()
    .min(1, "Buyer name is required")
    .min(2, "Buyer name must be at least 2 characters"),
  customerEmail: z
    .email("Please enter a valid email address")
    .min(1, "Email address is required"),
  productName: z
    .string()
    .min(1, "Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  productPrice: z
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0")
    .min(0.01, "Price must be at least $0.01"),
  productDescription: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "Description is required",
    })
    .refine((val) => val.trim().length >= 10, {
      message: "Description must be at least 10 characters",
    }),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || z.url().safeParse(val).success, {
      message: "Please enter a valid URL",
    }),
});

export const OrderForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      customerName: "John Doe",
      customerEmail: "john@example.com",
      productName: "Premium Widget",
      productPrice: 99.99,
      productDescription: "",
      imageUrl: "https://example.com/image.jpg",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
          <div className="space-y-2">
            <label
              htmlFor="customerName"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <User className="w-4 h-4" />
              Buyer Name
            </label>
            <input
              type="text"
              id="customerName"
              {...form.register("customerName")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                form.formState.errors.customerName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {form.formState.errors.customerName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.customerName.message}
              </p>
            )}
          </div>

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
              Price (USD)
            </label>
            <input
              type="number"
              id="productPrice"
              step="0.01"
              {...form.register("productPrice", { valueAsNumber: true })}
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
              htmlFor="productDescription"
              className="flex items-center gap-2 text-gray-700 font-medium"
            >
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              id="productDescription"
              {...form.register("productDescription")}
              rows={3}
              placeholder="Enter product description..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-y ${
                form.formState.errors.productDescription
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {form.formState.errors.productDescription && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.productDescription.message}
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
            className="cursor-pointer w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-base"
          >
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
};
