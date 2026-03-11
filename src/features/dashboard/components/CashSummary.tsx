import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";

export interface PaymentMethodRow {
  id: string;
  label: string;
  icon: string;
  iconStyle: string;
  amount: string;
}

interface CashSummaryProps {
  rows: PaymentMethodRow[];
  total: string;
}

export function CashSummary({ rows, total }: CashSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de caja</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`size-8 rounded-lg flex items-center justify-center ${row.iconStyle}`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {row.icon}
                  </span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {row.label}
                </span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {row.amount}
              </span>
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">Total</span>
            <span className="text-lg font-bold text-brand">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
