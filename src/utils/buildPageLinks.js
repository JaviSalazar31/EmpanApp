export function buildPageLinks({
  baseUrl, pathname, page,
  hasPrevPage, hasNextPage, prevPage, nextPage,
  originalQuery
}) {
  const url = new URL(pathname, baseUrl);

  const build = (p) => {
    const u = new URL(url);
    Object.entries(originalQuery || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v);
    });
    if (p) u.searchParams.set('page', p);
    return u.toString();
  };

  return {
    prevLink: hasPrevPage ? build(prevPage) : null,
    nextLink: hasNextPage ? build(nextPage) : null,
  };
}


export default buildPageLinks;
