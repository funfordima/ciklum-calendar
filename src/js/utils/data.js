export default class Data {
  static sendData(url, data) {
    /* eslint quotes: 0 */
    /* eslint no-useless-escape: 0 */
    const newData = JSON.stringify({ data: JSON.stringify(data), id: "string" }).replace(/"/g, '\"');

    return fetch(url, {
      method: 'POST',
      body: newData,
      headers: {
        'Content-type': 'application/json; charset=utf-8',
      },
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });
  }

  static async getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  }

  static deleteData(url, id) {
    return fetch(`${url}/${id}`, {
      method: 'DELETE',
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });
  }

  static putData(url, data, id) {
    const newData = JSON.stringify({ data: JSON.stringify(data), id }).replace(/"/g, '\"');

    return fetch(`${url}/${id}`, {
      method: 'PUT',
      body: newData,
      headers: {
        'Content-type': 'application/json; charset=utf-8',
      },
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });
  }
}
