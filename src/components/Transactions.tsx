
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Coins } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: string;
  created_at: string;
}

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <Card className="border-[#9b87f5]/50 bg-[#221F26] text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-[#9b87f5]">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-[#9b87f5] rounded-full"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No recent transactions.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b border-gray-700 pb-2 last:border-b-0">
                <div className="flex items-center">
                  <div className={`mr-3 p-2 rounded-full ${
                    transaction.amount >= 0 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {transaction.amount >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-400">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Coins className="h-3 w-3 mr-1 text-amber-400" />
                  <span className={`font-medium ${
                    transaction.amount >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {transaction.amount >= 0 ? "+" : ""}{transaction.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Transactions;
