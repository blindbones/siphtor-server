const HttpEntity = {
  Normal: (data) => ({
    rs: 1,
    msg: 'success',
    data,
  }),

  Error: (data) => ({
    rs: 0,
    msg: 'fail',
    data,
  }),

  Page: ({ pageSize, page, total, data }) => ({
    rs: 1,
    msg: 'success',
    page,
    pageSize,
    total,
    data,
  }),
}

module.exports = HttpEntity
