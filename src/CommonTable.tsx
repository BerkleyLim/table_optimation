import React, { useEffect, useRef, useState, forwardRef } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

// 📌 Column 타입 정의
interface Column {
  key: string;
  label: string;
}

// 📌 TableProps 타입 정의
interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  rowMergeKey?: string; // 병합할 키 (예: "category")
  height?: number;
}

// 📌 CommonTable 컴포넌트
const CommonTable = forwardRef<HTMLDivElement, TableProps>(
  ({ columns, data, rowMergeKey, height = 400 }, ref) => {
    const [rowSpanMap, setRowSpanMap] = useState<Record<number, number>>({});
    const tableRefs = useRef<(HTMLTableCellElement | null)[][]>([]);

    useEffect(() => {
      calculateRowSpan();
    }, [data]);

    // ✅ rowSpan 자동 계산 (최적화)
    const calculateRowSpan = () => {
      if (!rowMergeKey) return;

      const rowSpanData: Record<number, number> = {};
      let lastKey = "";
      let rowSpanCount = 0;
      let startIndex = 0;

      data.forEach((row, index) => {
        if (row[rowMergeKey] !== lastKey) {
          if (lastKey) {
            rowSpanData[startIndex] = rowSpanCount;
          }
          lastKey = row[rowMergeKey];
          startIndex = index;
          rowSpanCount = 1;
        } else {
          rowSpanCount++;
        }
      });

      if (lastKey) {
        rowSpanData[startIndex] = rowSpanCount;
      }

      setRowSpanMap(rowSpanData);
    };

    // ✅ 화살표 키 이동 최적화
    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLTableCellElement>,
      rowIndex: number,
      colIndex: number
    ) => {
      event.preventDefault();
      let newRow = rowIndex;
      let newCol = colIndex;

      switch (event.key) {
        case "ArrowUp":
          newRow = Math.max(rowIndex - 1, 0);
          break;
        case "ArrowDown":
          newRow = Math.min(rowIndex + 1, data.length - 1);
          break;
        case "ArrowLeft":
          newCol = Math.max(colIndex - 1, 0);
          break;
        case "ArrowRight":
          newCol = Math.min(colIndex + 1, columns.length - 1);
          break;
        default:
          return;
      }

      tableRefs.current[newRow]?.[newCol]?.focus();
    };

    // ✅ 가상 리스트 렌더링 (react-window)
    const Row = ({ index, style }: ListChildComponentProps) => {
      const row = data[index];
      return (
        <tr key={index} className="text-center" style={style}>
          {columns.map((col, colIndex) => {
            if (col.key === rowMergeKey && rowSpanMap[index]) {
              return (
                <td
                  key={col.key}
                  rowSpan={rowSpanMap[index]}
                  className="border border-gray-300 p-2 bg-gray-100"
                  tabIndex={0}
                  ref={(el) => {
                    if (!tableRefs.current[index]) {
                      tableRefs.current[index] = [];
                    }
                    tableRefs.current[index][colIndex] = el;
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, colIndex)}
                >
                  {row[col.key]}
                </td>
              );
            } else if (col.key !== rowMergeKey && rowSpanMap[index]) {
              return (
                <td
                  key={col.key}
                  className="border border-gray-300 p-2"
                  tabIndex={0}
                  ref={(el) => {
                    if (!tableRefs.current[index]) {
                      tableRefs.current[index] = [];
                    }
                    tableRefs.current[index][colIndex] = el;
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, colIndex)}
                >
                  {row[col.key]}
                </td>
              );
            }
            return null;
          })}
        </tr>
      );
    };

    return (
      <div style={{ height, overflow: "auto" }} ref={ref}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="border border-gray-300 p-2">
                {col.label}
              </th>
            ))}
          </tr>
          </thead>
        </table>
        <List height={height} itemCount={data.length} itemSize={40} width="100%">
          {Row}
        </List>
      </div>
    );
  }
);

export default CommonTable;
