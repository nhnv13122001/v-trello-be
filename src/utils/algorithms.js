export const pagingSkipValue = (page, itemsPerPage) => {
  if (!page || !itemsPerPage || page <= 0 || itemsPerPage <= 0) return 0

  return (page - 1) * itemsPerPage
}
