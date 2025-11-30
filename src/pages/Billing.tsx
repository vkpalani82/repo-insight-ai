import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  order_id: string;
  payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export default function Billing() {
  const { user, profile, isPro } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) {
        setPayments(data);
      }
      setIsLoading(false);
    };

    fetchPayments();
  }, [user]);

  return (
    <Layout>
      <div className="container py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and view payment history.
          </p>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                {isPro ? (
                  <Zap className="h-6 w-6 text-primary" />
                ) : (
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPro
                    ? "Full access to all features"
                    : "Upgrade to unlock all features"}
                </p>
              </div>
            </div>
            {isPro ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                <Check className="h-4 w-4" />
                Active
              </span>
            ) : (
              <Button asChild variant="hero" size="sm">
                <Link to="/pricing">
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold mb-4">Payment History</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {payment.currency} {(payment.amount / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      payment.status === "success"
                        ? "bg-accent/10 text-accent"
                        : payment.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No payment history yet.</p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
