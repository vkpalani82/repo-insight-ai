import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { XCircle, RefreshCcw } from "lucide-react";

export default function PaymentFailed() {
  return (
    <Layout>
      <div className="container py-24 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
          >
            <XCircle className="h-10 w-10 text-destructive" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't process your payment. This could be due to insufficient
              funds, a declined card, or a network issue. Please try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="hero">
                <Link to="/pricing">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
