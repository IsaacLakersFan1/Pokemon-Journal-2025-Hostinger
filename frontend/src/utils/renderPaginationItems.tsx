import {
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export const renderPaginationItems = (
  currentPage: number,
  totalPages: number,
  handleChangePage: (page: number) => void
) => {
  const items = [];
  const maxVisiblePages = 5;

  // Agregar botón Previous
  items.push(
    <PaginationItem key="prev">
      <PaginationPrevious
        onClick={() => currentPage > 1 && handleChangePage(currentPage - 1)}
        className={
          currentPage <= 1
            ? "pointer-events-none opacity-50"
            : "cursor-pointer"
        }
      />
    </PaginationItem>
  );

  // Calcular el rango de páginas a mostrar
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Ajustar startPage si estamos cerca del final
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Mostrar primera página y ellipsis si es necesario
  if (startPage > 1) {
    items.push(
      <PaginationItem key="1">
        <PaginationLink
          onClick={() => handleChangePage(1)}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (startPage > 2) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
  }

  // Mostrar páginas del rango calculado
  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <PaginationItem key={i}>
        <PaginationLink
          isActive={currentPage === i}
          onClick={() => handleChangePage(i)}
          className="cursor-pointer"
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Mostrar última página y ellipsis si es necesario
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          onClick={() => handleChangePage(totalPages)}
          className="cursor-pointer"
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Agregar botón Next
  items.push(
    <PaginationItem key="next">
      <PaginationNext
        onClick={() =>
          currentPage < totalPages && handleChangePage(currentPage + 1)
        }
        className={
          currentPage >= totalPages
            ? "pointer-events-none opacity-50"
            : "cursor-pointer"
        }
      />
    </PaginationItem>
  );

  return items;
}; 