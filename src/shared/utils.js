module.exports = {
  removeHtmlTags(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },
  formatDate(date) {
    return date
      .split('-')
      .reverse()
      .join('.');
  },
  parseJwt(token) {
    const payload = Buffer.from(token.split('.')[1], 'base64');
    return JSON.parse(payload.toString());
  }
};
