"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/app/components/ui/table";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/src/app/components/ui/input";
import { Button } from "@/src/app/components/ui/button";
import { Checkbox } from "@/src/app/components/ui/checkbox";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Trash2,
  Save,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Presentation,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/src/app/components/ui/dropdown-menu";

// Define proper types for column meta
interface ColumnMeta {
  pinned?: "left" | "right";
  width?: number;
  leftOffset?: number;
}

interface DataTableProps<TData extends { id: number | string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showCheckboxes?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
  isAdd?: boolean;
  editableColumns?: string[];
  onSave?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onApprove?: (row: TData) => void;
  onReject?: (row: TData) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onExportExcel?: () => void;
  onExportCsv?: () => void;
  onExportWord?: () => void;
  onExportText?: () => void;
  onExportPdf?: () => void;
  showColumnVisibility?: boolean;
  defaultPageSize?: number;
}

export function AdvancedDataTable<
  TData extends { id: number | string },
  TValue
>({
  columns,
  data,
  showCheckboxes = false,
  isEdit = false,
  isDelete = false,
  isAdd = false,
  editableColumns = [],
  onSave,
  onDelete,
  onApprove,
  onReject,
  onRowSelectionChange,
  onExportExcel,
  onExportCsv,
  onExportWord,
  onExportText,
  onExportPdf,
  showColumnVisibility = false,
  defaultPageSize = 5,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [tableData, setTableData] = useState<TData[]>(data);

  const [editingState, setEditingState] = useState<{
    [key: number]: {
      isEditing: boolean;
      isNew: boolean;
      originalData?: TData;
    };
  }>({});

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const isColumnEditable = (columnKey: string) => {
    if (editableColumns.length === 0) return true;
    return editableColumns.includes(columnKey);
  };

  const createEditableCell = (column: ColumnDef<TData, TValue>) => {
    const columnKey = column.accessorKey as string;
    const columnHeader =
      typeof column.header === "function"
        ? "Enter value"
        : (column.header as string) || columnKey;

    return {
      ...column,
      cell: (info: any) => {
        const row = info.row;
        const rowIndex = row.index;
        const isEditing = editingState[rowIndex]?.isEditing || false;

        if (isEditing && isColumnEditable(columnKey)) {
          const currentValue = info.getValue();
          return (
            <Input
              value={String(currentValue || "")}
              onChange={(e) =>
                handleCellEdit(rowIndex, columnKey, e.target.value)
              }
              className="w-full h-8"
              placeholder={`Enter ${columnHeader}`}
            />
          );
        }

        if (column.cell) {
          const result = column.cell(info);
          return result &&
            typeof result === "object" &&
            "$$typeof" in result ? (
            result
          ) : (
            <span>{String(info.getValue() || "")}</span>
          );
        }

        return <span>{String(info.getValue() || "")}</span>;
      },
    } as ColumnDef<TData, TValue>;
  };

  const tableColumns = useMemo(() => {
    const cols: ColumnDef<TData, TValue>[] = [];

    // Checkbox column - pinned left
    if (showCheckboxes) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <div className="pr-3">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => {
          const rowIndex = row.index;
          const isNew = editingState[rowIndex]?.isNew || false;
          return (
            <div className="pr-3">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) =>
                  !isNew && row.toggleSelected(!!value)
                }
                aria-label="Select row"
                disabled={isNew}
              />
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
        meta: {
          pinned: "left",
          width: 40,
        } as ColumnMeta,
      });
    }

    // Actions column - pinned left (after checkboxes)
    if (isEdit || isDelete) {
      cols.push({
        id: "actions",
        header: () => <div className="text-center pr-1">Actions</div>,
        cell: ({ row }) => {
          const rowData = row.original;
          const rowIndex = row.index;
          const isEditing = editingState[rowIndex]?.isEditing || false;
          const isNew = editingState[rowIndex]?.isNew || false;

          if (isEditing) {
            return (
              <div className="flex space-x-2 pr-1 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(rowData)}
                  className="h-8 w-8 p-0 text-green-600"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(rowIndex)}
                  className="h-8 w-8 p-0 text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          }

          return (
            <div className="flex space-x-3 pr-1 justify-center">
              {isEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(rowData, rowIndex)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {isDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete?.(rowData)}
                  className="h-8 w-8 p-0 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
        meta: {
          pinned: "left",
          width: 60,
        } as ColumnMeta,
      });
    }

    // Regular columns with proper meta typing
    const editableColumns = columns.map((column) => {
      const editableColumn = createEditableCell(column);
      return {
        ...editableColumn,
        meta: {
          ...(editableColumn.meta as ColumnMeta),
          width: (editableColumn.meta as ColumnMeta)?.width || 150,
        } as ColumnMeta,
      };
    });
    cols.push(...editableColumns);

    return cols;
  }, [
    showCheckboxes,
    columns,
    editingState,
    isEdit,
    isDelete,
    onDelete,
  ]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      if (onRowSelectionChange) {
        const selectedRows = table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original);
        onRowSelectionChange(selectedRows);
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });
 
  // Safe meta access helper function
  const getColumnMeta = (column: any): ColumnMeta => {
    return (column.columnDef.meta as ColumnMeta) || {};
  };

  // Helper function to calculate left position for sticky columns
  const getStickyLeftPosition = (column: any, index: number) => {
    const meta = getColumnMeta(column);
    if (meta.pinned !== "left") return 0;

    let left = 0;
    const allColumns = table.getAllColumns();

    for (let i = 0; i < index; i++) {
      const prevMeta = getColumnMeta(allColumns[i]);
      if (prevMeta.pinned === "left") {
        left += prevMeta.width || 80;
      }
    }

    return left;
  };

  const handleCellEdit = (rowIndex: number, columnKey: string, value: any) => {
    setTableData((prev) =>
      prev.map((item, index) =>
        index === rowIndex ? { ...item, [columnKey]: value } : item
      )
    );
  };

  const handleAddRow = () => {
    const hasNewRow = Object.values(editingState).some((state) => state.isNew);
    if (hasNewRow) {
      console.log("Please save or cancel the current new row first");
      return;
    }

    const newRow = {
      id: "new-" + Date.now(),
    } as TData;

    setTableData((prev) => [newRow, ...prev]);

    setEditingState((prev) => ({
      ...prev,
      0: {
        isEditing: true,
        isNew: true,
        originalData: newRow,
      },
    }));
    setCurrentPage(1);
    table.setPageIndex(0);
  };

  const handleEdit = (row: TData, rowIndex: number) => {
    const currentEditingState = editingState[rowIndex];

    if (currentEditingState?.isEditing) {
      return;
    }

    setEditingState((prev) => ({
      ...prev,
      [rowIndex]: {
        isEditing: true,
        isNew: false,
        originalData: { ...row },
      },
    }));
  };

  const handleSave = (row: TData) => {
    const rowIndex = tableData.findIndex((item) => item.id === row.id);
    const isNew = editingState[rowIndex]?.isNew || false;

    if (isNew) {
      const updatedRow = { ...row, id: Date.now() };
      setTableData((prev) =>
        prev.map((item, index) => (index === rowIndex ? updatedRow : item))
      );
      onSave?.(updatedRow);
    } else {
      onSave?.(row);
    }

    setEditingState((prev) => {
      const newState = { ...prev };
      delete newState[rowIndex];
      return newState;
    });
  };

  const handleCancel = (rowIndex: number) => {
    const originalData = editingState[rowIndex]?.originalData;
    const isNew = editingState[rowIndex]?.isNew || false;

    if (isNew) {
      setTableData((prev) => prev.filter((item, index) => index !== rowIndex));
    } else if (originalData) {
      setTableData((prev) =>
        prev.map((item, index) => (index === rowIndex ? originalData : item))
      );
    }

    setEditingState((prev) => {
      const newState = { ...prev };
      delete newState[rowIndex];
      return newState;
    });
  };

  const handleApprove = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedRows.length > 0) {
      console.log("Approving rows:", selectedRows);
      selectedRows.forEach((row) => onApprove?.(row));
    } else {
      console.log("No rows selected to approve");
    }
  };

  const handleReject = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (selectedRows.length > 0) {
      console.log("Rejecting rows:", selectedRows);
      selectedRows.forEach((row) => onReject?.(row));
    } else {
      console.log("No rows selected to reject");
    }
  };

  const totalPages = Math.ceil(
    table.getFilteredRowModel().rows.length / pageSize
  );

  return (
    <div className="space-y-4">
      {/* Header with Actions on LEFT and Search/Export on RIGHT */}
      <div className="flex items-center justify-between">
        {/* LEFT SIDE: Action Buttons */}
        <div className="flex items-center space-x-2">
          {isAdd && (
            <Button
              onClick={handleAddRow}
              className="flex items-center space-x-2"
              disabled={Object.values(editingState).some((state) => state.isNew)}
            >
              <Plus className="h-4 w-4" />
              <span>ADD</span>
            </Button>
          )}

          {onApprove && (
            <Button
              onClick={handleApprove}
              variant="outline"
              className="flex items-center space-x-2 text-green-600"
            >
              <CheckCircle className="h-4 w-4" />
              <span>APPROVE</span>
            </Button>
          )}

          {onReject && (
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex items-center space-x-2 text-red-600"
            >
              <XCircle className="h-4 w-4" />
              <span>REJECT</span>
            </Button>
          )}
        </div>

        {/* RIGHT SIDE: Search, Column Visibility, and Export Buttons */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all columns..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>

          {/* Column Visibility Dropdown */}
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

          {/* Divider */}
          {(onExportExcel || onExportCsv || onExportWord || onExportText || onExportPdf) && (
            <div className="border-l border-gray-300 h-10 mx-4"></div>
          )}
          {/* Export Buttons */}
          {(onExportExcel || onExportCsv || onExportWord || onExportText || onExportPdf) && (
            <div className="flex items-center space-x-3">
              {onExportExcel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportExcel()}
                  className="h-10 w-10 p-0 text-green-600"
                  title="Export to Excel"
                >
                  <FileSpreadsheet className="h-5 w-5" />
                </Button>
              )}
              {onExportCsv && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportCsv()}
                  className="h-10 w-10 p-0 text-green-400"
                  title="Export to CSV"
                >
                  <FileCode className="h-5 w-5" />
                </Button>
              )}
              {onExportWord && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportWord()}
                  className="h-10 w-10 p-0 text-blue-800"
                  title="Export to Word"
                >
                  <FileText className="h-5 w-5" />
                </Button>
              )}
              {onExportText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportText()}
                  className="h-10 w-10 p-0 text-gray-600"
                  title="Export to Text"
                >
                  <FileText className="h-5 w-5" />
                </Button>
              )}
              {onExportPdf && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportPdf()}
                  className="h-10 w-10 p-0 text-red-600"
                  title="Export to PDF"
                >
                  <FileText className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table with pinned columns */}
      <div className="rounded-md border overflow-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted/100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const meta = getColumnMeta(header.column);
                  const isPinned = meta.pinned === "left";
                  const leftPosition = getStickyLeftPosition(header.column, index);
                  const width = meta.width || 150;

                  return (
                    <TableHead
                      key={header.id}
                      className={`
                        whitespace-nowrap px-4 py-2 font-semibold border-r
                        ${isPinned ? "sticky bg-muted/100 z-10" : ""}
                      `}
                      style={
                        isPinned
                          ? {
                              left: `${leftPosition}px`,
                              boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)",
                              minWidth: `${width}px`,
                              width: `${width}px`,
                            }
                          : {}
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const meta = getColumnMeta(cell.column);
                    const isPinned = meta.pinned === "left";
                    const leftPosition = getStickyLeftPosition(cell.column, index);
                    const width = meta.width || 150;

                    return (
                      <TableCell
                        key={cell.id}
                        className={`
                          px-4 py-2 border-r break-words
                          ${isPinned ? "sticky bg-background z-10" : ""}
                        `}
                        style={
                          isPinned
                            ? {
                                left: `${leftPosition}px`,
                                boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)",
                                minWidth: `${width}px`,
                                width: `${width}px`,
                              }
                            : {}
                        }
                      >
                        <div>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. Page{" "}
          {currentPage} of {totalPages}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                table.setPageSize(newSize);
                setCurrentPage(1);
                table.setPageIndex(0);
              }}
              className="border rounded p-1 text-sm"
            >
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.setPageIndex(0);
                setCurrentPage(1);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.previousPage();
                setCurrentPage(currentPage - 1);
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="mx-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.nextPage();
                setCurrentPage(currentPage + 1);
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
                setCurrentPage(totalPages);
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// How to use 
// <AdvancedDataTable
// columns={columns}
// data={activeUserData}
// showCheckboxes={true}
// isAdd={true}
// isEdit={true}
// isDelete={true}
// showColumnVisibility={true}
// editableColumns={["USERID", "NAME", "USERGROUP","MULTIGROUP","DISABLEUSER","EMAILID","LOGINID", "DEPT_NAME","INPUTTER"]} // Only these columns will be editable
// onSave={() => console.log("onSave")}
// onDelete={() => console.log("onDelete")}
// defaultPageSize={10}
// onApprove={() => console.log("onApprovel")} 
// onReject={() => console.log("onReject")} 
// onExportExcel={() => console.log("Export to Excel")}
// onExportCsv={() => console.log("Export to CSV")}
// onExportWord={() => console.log("Export to Word")}
// onExportText={() => console.log("Export to Text")}
// onExportPdf={() => console.log("Export to PDF")}
// />