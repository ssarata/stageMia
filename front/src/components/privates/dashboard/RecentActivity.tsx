import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentActivityProps {
  data: Array<{
    date: Date;
    count: number;
  }>;
}

const RecentActivity = ({ data }: RecentActivityProps) => {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "dd MMM", { locale: fr }),
    messages: item.count,
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Activité des Messages (7 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Aucune activité récente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
