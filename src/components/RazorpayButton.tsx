import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RazorpayButtonProps {
  amount: number;
  buttonText?: string;
  paymentButtonId?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayButton = ({ 
  amount, 
  buttonText = "Support Us", 
  paymentButtonId = "pl_QwtLbJyFa0dzro",
  className = "",
  onSuccess,
  onError
}: RazorpayButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        toast({
          title: "Payment Error",
          description: "Failed to load payment system. Please try again later.",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    };

    loadRazorpayScript();
  }, [toast]);

  const handlePayment = () => {
    if (!scriptLoaded) {
      toast({
        title: "Payment System Loading",
        description: "Please wait while we load the payment system.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a form element dynamically for Razorpay
      const form = document.createElement('form');
      const script = document.createElement('script');
      
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.setAttribute('data-payment_button_id', paymentButtonId);
      script.async = true;
      
      // Add success/error handling
      script.onload = () => {
        setIsLoading(false);
        if (onSuccess) onSuccess();
      };
      
      script.onerror = (error) => {
        setIsLoading(false);
        console.error('Razorpay payment error:', error);
        toast({
          title: "Payment Error",
          description: "Payment processing failed. Please try again.",
          variant: "destructive",
        });
        if (onError) onError(error);
      };

      form.appendChild(script);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(form);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      if (onError) onError(error);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handlePayment}
        disabled={isLoading || !scriptLoaded}
        className={`w-full ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {buttonText} - ₹{amount.toLocaleString()}
          </>
        )}
      </Button>
      
      <div ref={containerRef} className="razorpay-container" />
      
      {!scriptLoaded && (
        <p className="text-xs text-muted-foreground text-center">
          Loading payment system...
        </p>
      )}
    </div>
  );
};

export default RazorpayButton;