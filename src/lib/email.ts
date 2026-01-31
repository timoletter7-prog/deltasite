import emailjs from '@emailjs/browser';

// EmailJS configuration from environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface OrderEmailData {
  to_email: string;
  to_name: string;
  customer_name: string;
  order_number: string;
  products: string;
  total_price: string;
  payment_method: string;
}

export const sendOrderConfirmationEmail = async (orderData: OrderEmailData): Promise<boolean> => {
  try {
    // Format products for HTML email
    const formattedProducts = orderData.products.replace(/\n/g, '<br>');

    const templateParams = {
      to_email: orderData.to_email,
      to_name: orderData.to_name,
      customer_name: orderData.customer_name,
      order_number: orderData.order_number,
      products: formattedProducts,
      total_price: orderData.total_price,
      payment_method: orderData.payment_method,
    };

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
  } else {
    console.warn('EmailJS PUBLIC_KEY not found in environment variables');
  }
};
