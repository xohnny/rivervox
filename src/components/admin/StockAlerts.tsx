import { AlertTriangle, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockAlert } from '@/hooks/useInventory';
import { formatDistanceToNow } from 'date-fns';

interface StockAlertsProps {
  alerts: StockAlert[];
  onAcknowledge: (alertId: string) => void;
}

const StockAlerts = ({ alerts, onAcknowledge }: StockAlertsProps) => {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No active stock alerts</p>
            <p className="text-sm text-muted-foreground">
              All products are well stocked
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Stock Alerts
          <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
            {alerts.length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-amber-900 truncate">
                {alert.product_name}
              </p>
              <p className="text-sm text-amber-700">
                {alert.current_stock === 0 ? (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                ) : (
                  <>
                    Only <span className="font-semibold">{alert.current_stock}</span> left
                    (threshold: {alert.threshold})
                  </>
                )}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-3 shrink-0"
              onClick={() => onAcknowledge(alert.id)}
            >
              <Check className="w-4 h-4 mr-1" />
              Ack
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StockAlerts;
