export default class Data {
  constructor(url) {
    this.url = url;

    if (!Data.instance) {
      Data.instance = this;
    }
    return Data.instance;
  }

  async sendData(endPoint, data) {
    /* eslint quotes: 0 */
    /* eslint no-useless-escape: 0 */
    const newData = JSON.stringify({ data: JSON.stringify(data), id: "string" }).replace(/"/g, '\"');

    const response = await fetch(`${this.url}${endPoint}`, {
      method: 'POST',
      body: newData,
      headers: {
        'Content-type': 'application/json; charset=utf-8',
      },
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });

    return response;
  }

  async getData(endPoint) {
    const response = await fetch(`${this.url}${endPoint}`);

    if (!response.ok) {
      throw new Error(`Could not fetch ${this.url}, status: ${response.status}`);
    }

    return response;
  }

  async deleteData(endPoint, id) {
    const response = await fetch(`${this.url}${endPoint}/${id}`, {
      method: 'DELETE',
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });

    return response;
  }

  async putData(endPoint, data, id) {
    const newData = JSON.stringify({ data: JSON.stringify(data), id }).replace(/"/g, '\"');

    const response = await fetch(`${this.url}${endPoint}/${id}`, {
      method: 'PUT',
      body: newData,
      headers: {
        'Content-type': 'application/json; charset=utf-8',
      },
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });

    return response;
  }
}
