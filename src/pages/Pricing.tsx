import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Check, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const proFeatures = [
  "Unlimited repository analysis",
  "Full architecture insights",
  "Security vulnerability scanning",
  "AI-generated test suggestions",
  "Dependency mapping & analysis",
  "Priority support",
  "Export reports (PDF/JSON)",
  "Team collaboration (coming soon)",
];

const PLAN_AMOUNT = 99900; // ₹999 in paise
const PLAN_CURRENCY = "INR";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    email?: string;
    name?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function Pricing() {
  const { user, isPro, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/pricing" } } });
      return;
    }

    if (isPro) {
      toast.info("You're already a Pro member!");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "razorpay-create-order",
        {
          body: { amount: PLAN_AMOUNT, currency: PLAN_CURRENCY },
        }
      );

      if (orderError || !orderData?.order_id) {
        throw new Error(orderError?.message || "Failed to create order");
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      }

      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RepoAnalyzer",
        description: "Pro Plan Subscription",
        order_id: orderData.order_id,
        prefill: {
          email: user.email || "",
          name: user.user_metadata?.full_name || "",
        },
        theme: {
          color: "#14b8a6",
        },
        handler: async (response: RazorpayResponse) => {
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "razorpay-verify-payment",
              {
                body: {
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              navigate("/payment-failed");
              return;
            }

            await refreshProfile();
            navigate("/payment-success");
          } catch {
            navigate("/payment-failed");
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Unlock the full power of AI-driven repository analysis with our Pro plan.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Free Plan */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-muted-foreground mb-4">For exploring the platform</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-muted-foreground" />
                View pricing & features
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-muted-foreground" />
                Google authentication
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="glass-card p-8 border-primary/50 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Zap className="h-3 w-3" />
                Popular
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-4">For serious developers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹999</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            {isPro ? (
              <Button variant="outline" className="w-full" disabled>
                <Check className="mr-2 h-4 w-4" />
                You're a Pro
              </Button>
            ) : (
              <Button
                variant="hero"
                className="w-full"
                onClick={handleUpgrade}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Upgrade to Pro
              </Button>
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All payments are processed securely via Razorpay.
          <br />
          Cancel anytime. No questions asked.
        </motion.p>
      </div>
    </Layout>
  );
}
