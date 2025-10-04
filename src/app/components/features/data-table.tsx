"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  getExpandedRowModel,
  ExpandedState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/app/ui/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/ui/components/ui/table";
import { Button } from "@/src/app/ui/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/src/app/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGridStore } from "@/store";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { exportToExcel } from "./exportToExcel";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  placeholder?: string;
  searchColumn?: any;
  gridType?: string;
  showPageSize?: boolean;
  showColumnVisibility?: boolean;
  showExcelDownload?: boolean;
  showFooter?: boolean;
  showSaveButton?: boolean;
  isFixedPageSize?: boolean;
  fixedPageSize?: number;
  roles?: boolean;
  menu?: boolean;
  setReloadCounter?: React.Dispatch<React.SetStateAction<number>>;
  selectedRole?: { value: string; label: string };
  total?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder,
  searchColumn,
  gridType = "main",
  showPageSize = true,
  showColumnVisibility = true,
  showExcelDownload = true,
  showFooter = true,
  isFixedPageSize = false,
  fixedPageSize = 5,
  total,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: isFixedPageSize
      ? fixedPageSize
      : useGridStore((state) =>
          gridType === "main" ? state.pageLength : state.subGridPageLength
        ), // Default page size
  });

  const setPageLength = useGridStore((state) => state.setPageLength);
  const setSubGridPageLength = useGridStore(
    (state) => state.setSubGridPageLength
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      expanded,
    },
    initialState: {
      pagination: {
        pageSize: isFixedPageSize ? fixedPageSize : 15,
        pageIndex: 0,
      },
    },
  });
  const handleDownload = () => {
    const isFiltered = columnFilters.length > 0;

    const exportData = isFiltered
      ? table.getFilteredRowModel().rows.map((row) => row.original)
      : data;
    exportToExcel(exportData, isFiltered ? "Filtered Data" : "All Data");
  };

  return (
    <div>
      <div className="flex items-center py-2">
        {placeholder &&
          searchColumn &&
          placeholder !== "" &&
          searchColumn !== "" && (
            <Input
              placeholder={placeholder}
              value={
                (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          )}
        {showPageSize && (
          <Select
            onValueChange={(value) => {
              setPagination({ ...pagination, pageSize: Number(value) });
              if (gridType === "sub") {
                setSubGridPageLength(Number(value));
              }
              if (gridType === "main") {
                setPageLength(Number(value));
              }
            }}
            defaultValue={
              fixedPageSize !== 0
                ? pagination.pageSize.toString()
                : fixedPageSize.toString()
            }
          >
            <SelectTrigger
              className={
                placeholder &&
                searchColumn &&
                placeholder !== "" &&
                searchColumn !== ""
                  ? "w-[180px] ml-5"
                  : "w-[120px] "
              }
            >
              <SelectValue placeholder="Select " />
            </SelectTrigger>

            <SelectContent>
              {[5, 10, 15, 20, 25, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  Show {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="ml-auto flex items-center gap-2 pr-4">
          {showExcelDownload && (
            <>
              {/* <div className="ml-auto flex items-center none">
              <Select
                onValueChange={(value) => {
                  if (value === "filtered") {
                    handleDownload();
                  } else {
                    handleDownload();
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Export Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Export All Data</SelectItem>
                  <SelectItem value="filtered">
                    Export Filtered Data
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
              <div className="cursor-pointer">
                <span className="sr-only">Download Excel</span>
                <Image
                  src={"/images/png/excel.png"}
                  alt="Download Excel"
                  width={24}
                  height={24}
                  onClick={handleDownload}
                />
              </div>
            </>
          )}
          {showColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <ScrollArea className="w-full h-[86%]">
        <div className="rounded-md border">
          <Table className="h-fit max-h-80 overflow-y-auto relative">
            <TableHeader className="sticky top-0 ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: `${header.column.columnDef.size}px`,
                          minWidth: header.column.columnDef.size || "auto",
                          maxWidth: header.column.columnDef.size || "auto",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {/* 
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
                
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody> */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,

                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                  {total && (
                    <TableRow className="bg-muted font-semibold text-right">
                      {table.getVisibleFlatColumns().map((column, index) => {
                        const colId = column.id;

                        const totalValue = table
                          .getFilteredRowModel()
                          .rows.reduce((sum, row) => {
                            const value = row.getValue(colId);
                            return typeof value === "number"
                              ? sum + value
                              : sum;
                          }, 0);

                        const isNumeric = table
                          .getFilteredRowModel()
                          .rows.some(
                            (row) => typeof row.getValue(colId) === "number"
                          );

                        // Find first numeric column index
                        const firstNumericIndex = table
                          .getVisibleFlatColumns()
                          .findIndex((col) =>
                            table
                              .getFilteredRowModel()
                              .rows.some(
                                (row) =>
                                  typeof row.getValue(col.id) === "number"
                              )
                          );

                        const labelIndex =
                          firstNumericIndex > 0 ? firstNumericIndex - 1 : 0;

                        return (
                          <TableCell key={colId}>
                            {index === labelIndex
                              ? "Total"
                              : isNumeric && totalValue !== 0
                              ? totalValue.toLocaleString("en-IN", {
                                  maximumFractionDigits: 0,
                                })
                              : ""}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      {showFooter && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <span className="flex items-center gap-2 text-sm">
            <div>Page</div>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <span className="flex items-center gap-2 text-sm">
            | Go to page:
            <Input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 text-sm mr-2 h-8 "
            />
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
      )}
    </div>
  );
}
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
