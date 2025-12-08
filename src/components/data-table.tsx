import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Group,
  Menu,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  Columns,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Header } from "@tanstack/react-table";

// Draggable Table Header Component
function DraggableTableHeader<TData>({
  header,
  enableColumnOrdering,
  enableColumnResizing,
  enableSorting,
}: {
  header: Header<TData, unknown>;
  enableColumnOrdering: boolean;
  enableColumnResizing: boolean;
  enableSorting: boolean;
}) {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
      disabled: !enableColumnOrdering,
    });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: enableColumnResizing ? header.getSize() : undefined,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Table.Th ref={setNodeRef} style={style}>
      <Group gap="xs" wrap="nowrap">
        {enableColumnOrdering && (
          <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
            <GripVertical className="size-4 text-gray-400" />
          </div>
        )}
        {flexRender(header.column.columnDef.header, header.getContext())}
        {enableSorting && header.column.getCanSort() && (
          <Tooltip
            label={
              header.column.getIsSorted()
                ? header.column.getIsSorted() === "desc"
                  ? "Sort ascending"
                  : "Sort descending"
                : "Sort"
            }
          >
            <ActionIcon
              onClick={header.column.getToggleSortingHandler()}
              size="sm"
              variant="subtle"
            >
              {header.column.getIsSorted() === "desc" ? (
                <ArrowDown className="size-3.5" />
              ) : (
                <ArrowUp className="size-3.5" />
              )}
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      {enableColumnResizing && (
        <button
          aria-label="Resize column"
          className={`resizer ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          style={{
            background: header.column.getIsResizing()
              ? "var(--mantine-color-gray-6)"
              : "var(--mantine-color-gray-3)",
            border: "none",
            cursor: "col-resize",
            height: "100%",
            padding: 0,
            position: "absolute",
            right: 0,
            top: 0,
            touchAction: "none",
            userSelect: "none",
            width: "5px",
          }}
          type="button"
        />
      )}
    </Table.Th>
  );
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  enableColumnOrdering?: boolean;
  enableColumnPinning?: boolean;
  enableColumnResizing?: boolean;
  enableColumnVisibility?: boolean;
  enableFilters?: boolean;
  enableMultiRowSelection?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableSearch?: boolean;
  enableSorting?: boolean;
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  loading?: boolean;
  pageSize?: number;
  searchPlaceholder?: string;
}

export function DataTable<TData>({
  columns,
  data,
  enableColumnOrdering = false,
  enableColumnPinning = false,
  enableColumnResizing = false,
  enableColumnVisibility = true,
  enableFilters = true,
  enableMultiRowSelection = true,
  enablePagination = true,
  enableRowSelection = false,
  enableSearch = true,
  enableSorting = true,
  filters = [],
  loading = false,
  pageSize = 10,
  searchPlaceholder = "Search...",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map(({ id }) => id as string)
  );

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColumnOrder((columns) => {
      const oldIndex = columns.indexOf(active.id as string);
      const newIndex = columns.indexOf(over.id as string);
      return arrayMove(columns, oldIndex, newIndex);
    });
  };

  const table = useReactTable({
    columns,
    data,
    enableColumnPinning,
    enableColumnResizing,
    enableMultiRowSelection,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFilters ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    globalFilterFn: "includesString",
    onColumnFiltersChange: setColumnFilters,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    state: {
      columnFilters,
      columnOrder,
      columnPinning,
      columnVisibility,
      globalFilter,
      pagination,
      rowSelection,
      sorting,
    },
  });

  const handleFilterChange = (key: string, value: null | string) => {
    if (value) {
      setColumnFilters((prev) => [
        ...prev.filter((filter) => filter.id !== key),
        { id: key, value },
      ]);
    } else {
      setColumnFilters((prev) => prev.filter((filter) => filter.id !== key));
    }
  };

  if (loading) {
    return (
      <Card p="lg" radius="lg" withBorder>
        <Text>Loading...</Text>
      </Card>
    );
  }

  return (
    <Card p="lg" radius="lg" withBorder>
      <Stack gap="md">
        {/* Search and Filters */}
        {enableSearch ||
        enableFilters ||
        enableColumnVisibility ||
        enableRowSelection ? (
          <Group justify="space-between">
            <Group>
              {enableSearch && (
                <TextInput
                  leftSection={<Search size={16} />}
                  onChange={(event) =>
                    setGlobalFilter(event.currentTarget.value)
                  }
                  placeholder={searchPlaceholder}
                  style={{ minWidth: 250 }}
                  value={globalFilter}
                />
              )}
              {enableFilters &&
                filters.map((filter) => (
                  <Select
                    clearable
                    searchable
                    data={filter.options}
                    key={filter.key}
                    leftSection={<Filter size={16} />}
                    onChange={(value) => handleFilterChange(filter.key, value)}
                    placeholder={filter.label}
                    value={
                      columnFilters.find(({ id }) => id === filter.key)
                        ?.value as string | undefined
                    }
                  />
                ))}
            </Group>
            <Group>
              {enableRowSelection && Object.keys(rowSelection).length > 0 && (
                <Text c="dimmed" size="sm">
                  {Object.keys(rowSelection).length} row(s) selected
                </Text>
              )}
              {enableColumnVisibility && (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button
                      leftSection={<Columns size={16} />}
                      size="sm"
                      variant="subtle"
                    >
                      Columns
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Toggle columns</Menu.Label>
                    {table.getAllLeafColumns().map((column) => {
                      return (
                        <Menu.Item
                          key={column.id}
                          onClick={(e) => {
                            e.preventDefault();
                            column.toggleVisibility();
                          }}
                        >
                          <Group gap="xs">
                            <Checkbox
                              checked={column.getIsVisible()}
                              onChange={() => column.toggleVisibility()}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Text size="sm">
                              {typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id}
                            </Text>
                          </Group>
                        </Menu.Item>
                      );
                    })}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Group>
        ) : null}

        {/* Table */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
        >
          <Table highlightOnHover striped>
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader
                        key={header.id}
                        header={header}
                        enableColumnOrdering={enableColumnOrdering}
                        enableColumnResizing={enableColumnResizing}
                        enableSorting={enableSorting}
                      />
                    ))}
                  </SortableContext>
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={columns.length}>
                    <Text c="dimmed" py="xl" ta="center">
                      No data available
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Table.Tr
                    key={row.id}
                    style={{
                      backgroundColor: row.getIsSelected()
                        ? "var(--mantine-color-primary-light)"
                        : undefined,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </DndContext>

        {/* Pagination */}
        {enablePagination ? (
          <Group justify="space-between">
            <Text c="dimmed" size="sm">
              Showing {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} entries
            </Text>
            <Pagination
              onChange={(page) =>
                setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
              }
              total={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
            />
          </Group>
        ) : null}
      </Stack>
    </Card>
  );
}
