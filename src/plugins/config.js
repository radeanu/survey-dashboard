const formulateOptions = {
  rules: {
    zero: ({ value }) => ['0'].includes(value)
  }
}

const dialogOptions = {
  html: true,
  loader: false,
  okText: 'Da',
  cancelText: 'Nu',
  animation: 'zoom'
}

export {
  formulateOptions,
  dialogOptions
}
