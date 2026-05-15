import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function ChartWidget({ data, title, dataKey, color = '#DC2626', xAxisLabel = 'Time', yAxisLabel = 'Value' }) {
  return (
    <div className="bg-transparent h-full flex flex-col">
      <h3 className="font-bold text-sm text-gray-400 mb-6 uppercase tracking-widest">{title}</h3>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="time"
              stroke="#4B5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#4B5563"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
        <span>{xAxisLabel}</span>
        <span>{yAxisLabel}</span>
      </div>
    </div>
  );
}
