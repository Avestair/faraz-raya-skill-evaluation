import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";

type UserTableSkeletonProps = {
  headers: {
    headerName: string;
    className?: string;
  }[];
  rowCount?: number;
};

export default function SkeletonTable({
  headers,
  rowCount = 5,
}: UserTableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHead>
          <TableRow className="flex w-full">
            {headers.map((header, index) => (
              <TableHeader
                key={index}
                className={`${header.className || ""} min-w-[70px] flex-1 px-4 py-3 md:min-w-[100px]`}
              >
                {header.headerName}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="flex w-full">
              {headers.map((header, colIndex) => (
                <TableCell
                  key={`${rowIndex}-${colIndex}`}
                  className={`${header.className || ""} min-w-[70px] flex-1 px-4 py-3 md:min-w-[100px]`}
                >
                  <div
                    className="animate-shimmer-diagonal h-4 rounded"
                    // style={{
                    //   width: `${Math.floor(Math.random() * (100 - 50) + 50)}px`, //for randomizing the width of cells
                    // }}
                  ></div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
