import { useEffect, useRef } from "react";

interface RazorpayButtonProps {
  amount: number;
  buttonText?: string;
  paymentButtonId?: string;
  className?: string;
}

const RazorpayButton = ({ 
  amount, 
  buttonText = "Support Us", 
  paymentButtonId = "pl_QwtLbJyFa0dzro",
  className = ""
}: RazorpayButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create the form and script elements as per Razorpay's documentation
      const form = document.createElement('form');
      const script = document.createElement('script');
      
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.setAttribute('data-payment_button_id', paymentButtonId);
      script.async = true;
      
      form.appendChild(script);
      containerRef.current.appendChild(form);
    }
  }, [paymentButtonId]);

  return (
    <div className={`razorpay-payment-button ${className}`}>
      <div ref={containerRef} />
    </div>
  );
};

export default RazorpayButton;