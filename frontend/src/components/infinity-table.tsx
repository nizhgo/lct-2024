import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Stack } from "components/stack.ts";
import { Input } from "components/input.tsx";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { ResponsiveTable, ColumnConfig } from "components/table.tsx";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";
import useDebounce from "utils/hooks/debounce.ts";

interface ResponsiveTableWrapperProps<T> {
  provider: InfinityScrollProvider<T>;
  columns: ColumnConfig[];
  renderRow: (item: T, columns: ColumnConfig[]) => React.ReactNode;
  searchPlaceholder?: string;
  filters?: Record<
    string,
    (props: { onChange: (value: string) => void }) => JSX.Element
  >;
}

const InfinityTable = observer(
  <T extends NonNullable<unknown>>({
    provider,
    columns,
    renderRow,
    searchPlaceholder,
    filters,
  }: ResponsiveTableWrapperProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, string>>(
      {},
    );
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
      const handleScroll = () => {
        const container = containerRef.current;
        if (
          container &&
          container.scrollHeight - container.scrollTop <=
            container.clientHeight + 400 &&
          !provider.isLoading
        ) {
          provider.loadMore();
        }
      };

      const container = containerRef.current;
      container?.addEventListener("scroll", handleScroll);
      return () => container?.removeEventListener("scroll", handleScroll);
    }, [provider]);

    useEffect(() => {
      provider.search(debouncedSearchTerm);
    }, [debouncedSearchTerm, provider]);

    useEffect(() => {
      provider.setFilters(filterValues);
    }, [filterValues, provider]);

    const handleSearch = (value: string) => {
      setSearchTerm(value);
    };

    const handleFilterChange = (key: string, value: string) => {
      console.log("Filter change", key, value);
      setFilterValues((prev) => ({ ...prev, [key]: value }));
    };

    const renderFilters = () => {
      if (!filters) return null;
      return Object.entries(filters).map(([key, FilterComponent]) => (
        <FilterComponent
          key={key}
          onChange={(value) => handleFilterChange(key, value)}
        />
      ));
    };

    return (
      <Stack wFull hFull direction={"column"} gap={20}>
        <Stack direction={"row"} align={"center"} gap={10}>
          <Input
            placeholder={searchPlaceholder || "Поиск"}
            style={{ width: "300px" }}
            withClear
            value={searchTerm}
            onChange={(e) => handleSearch(e)}
          />
        </Stack>

        <Stack direction={"row"} align={"center"} gap={10}>
          {renderFilters()}
        </Stack>

        <div ref={containerRef} style={{ overflowY: "auto", height: "100%" }}>
          {provider.isLoading && provider.data.length === 0 ? (
            <LoaderWrapper height={"100%"}>
              <Loader />
            </LoaderWrapper>
          ) : (
            <>
              <ResponsiveTable
                columns={columns}
                data={provider.data}
                renderRow={renderRow}
              />
              {provider.isLoading && provider.data.length > 0 && (
                <LoaderWrapper height={"100px"}>
                  <Loader />
                </LoaderWrapper>
              )}
            </>
          )}
        </div>
      </Stack>
    );
  },
);

export default InfinityTable;
