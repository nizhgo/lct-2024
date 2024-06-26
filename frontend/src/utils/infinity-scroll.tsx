import { makeAutoObservable } from "mobx";

interface FetchDataFunction<T> {
  (
    offset: number,
    limit: number,
    query?: string,
    filters?: Record<string, string>,
  ): Promise<T[]>;
}

export class InfinityScrollProvider<T> {
  data: T[] = [];
  isLoading: boolean = false;
  hasMore: boolean = true;
  offset: number = 0;
  limit: number = 20;
  searchValue: string = "";
  filters: Record<string, string> = {};

  constructor(private fetchData: FetchDataFunction<T>) {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    await this.loadMore();
  }

  async loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.isLoading = true;
      try {
        const newData = await this.fetchData(
          this.offset,
          this.limit,
          this.searchValue,
          this.filters,
        );
        if (newData.length < this.limit) {
          this.hasMore = false;
        }
        this.data = [...this.data, ...newData];
        this.offset += this.limit;
      } catch (error) {
        console.error("Failed to load more data", error);
        this.hasMore = false; // Stop further attempts if there is an error
      } finally {
        this.isLoading = false;
      }
    }
  }

  async search(query: string) {
    console.log("search", query);
    this.searchValue = query;
    this.reset();
    await this.loadMore();
  }

  reset() {
    this.offset = 0;
    this.hasMore = true;
    this.data = [];
  }

  setFilters(filters: Record<string, string>) {
    this.filters = filters;
    this.reset();
    this.loadMore();
  }
}
