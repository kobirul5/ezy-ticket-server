export type IBusTicketFilterRequest = {
  searchTerm?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  date?: string | undefined;
};


export type TTravelLocation = {
    name: string;
    address: string;
}
