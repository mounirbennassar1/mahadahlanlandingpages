import { BarList } from "./bar-list";

export function CitiesBar({ data }: { data: { city: string; count: number }[] }) {
  return (
    <BarList
      title="Leads by city"
      subtitle={`Top ${data.length} regions`}
      labelWidth={100}
      data={data.map((d) => ({ label: d.city, count: d.count }))}
    />
  );
}
