import axiosInstance from "../axiosConfig";

// Function to create a checkout session with Stripe
const createCheckoutSession = async (
  amount,
  userId,
  durationInDays = 2,
  currency = "usd"
) => {
  try {
    const response = await axiosInstance.post(
      "/checkout/create-checkout-session",
      {
        amount, // Amount in cents
        currency,
        userId,
        durationInDays,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials if needed
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export { createCheckoutSession };
