import { useState, useRef, useEffect } from "react";
import CommonTable from "./CommonTable";

// ✅ 더미 데이터 생성 (10000개)
const generateData = (count: number): Array<{ category: string; name: string; price: number }> => {
  const categories = ["과일", "야채", "음료"];
  return Array.from({ length: count }, (_, i) => ({
    category: categories[i % categories.length],
    name: `제품 ${i + 1}`,
    price: Math.floor(Math.random() * 5000) + 1000,
  }));
};

export default function TableExample() {
  const [data, setData] = useState<Array<{ category: string; name: string; price: number }>>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 초기 데이터 생성
    setData(generateData(10000));
  }, []);

  const columns = [
    { key: "category", label: "카테고리" },
    { key: "name", label: "이름", editable: true },
    { key: "price", label: "가격", editable: true },
  ];

  const updateData = (updatedData: Array<{ category: string; name: string; price: number }>) => {
    setData(updatedData);
  };

  return (
    <div className="p-4">
      <CommonTable ref={tableRef} columns={columns} data={data} rowMergeKey="category" height={500} onUpdate={updateData as any} />
    </div>
  );
}
