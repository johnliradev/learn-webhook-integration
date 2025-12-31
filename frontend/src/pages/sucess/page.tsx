import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

interface CheckoutData {
  payment_status: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}

const formatPrice = (cents: number): string => {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
};

export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Session ID not found");
      setIsLoading(false);
      return;
    }

    const fetchCheckoutData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/success?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve checkout session");
        }

        const checkoutData = await response.json();
        setData(checkoutData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-700">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
          <svg
            className="w-20 h-20 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-700 mb-6 text-center">{error}</p>
          <a
            href="/"
            className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center">
        <svg
          className="w-20 h-20 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M16 25l6 6 10-12"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6 text-center">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>

        {data && (
          <div className="w-full space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Payment Status:</span>
              <span className="text-gray-900 font-semibold capitalize">
                {data.payment_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Amount:</span>
              <span className="text-gray-900 font-semibold">
                {formatPrice(data.amount)}
              </span>
            </div>
            {data.customerName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Customer:</span>
                <span className="text-gray-900 font-semibold">
                  {data.customerName}
                </span>
              </div>
            )}
            {data.customerEmail && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-900 font-semibold">
                  {data.customerEmail}
                </span>
              </div>
            )}
          </div>
        )}

        <p className="text-gray-600 text-sm mb-6 text-center">
          You will receive a confirmation email shortly.
        </p>
        <a
          href="/"
          className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
        >
          Create Another Order
        </a>
      </div>
    </div>
  );
};
