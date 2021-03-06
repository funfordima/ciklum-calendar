export default class Data {
  constructor(url) {
    this.url = url;

    if (!Data.instance) {
      Data.instance = this;
    }
    return Data.instance;
  }

  async sendData(eventName, data) {
    /* eslint quotes: 0 */
    /* eslint no-useless-escape: 0 */
    const newData = JSON.stringify({ data: JSON.stringify(data), id: "string" }).replace(/"/g, '\"');

    const response = await fetch(`${this.url}${eventName}`, {
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

  async getData(eventName) {
    const response = await fetch(`${this.url}${eventName}`);

    if (!response.ok) {
      throw new Error(`Could not fetch ${this.url}, status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  }

  async deleteData(eventName, id) {
    const response = await fetch(`${this.url}${eventName}/${id}`, {
      method: 'DELETE',
    })
      .catch((err) => {
        throw new Error(`Could not fetch, message: ${err.message}`);
      });

    return response;
  }

  async putData(eventName, data, id) {
    const newData = JSON.stringify({ data: JSON.stringify(data), id }).replace(/"/g, '\"');

    const response = await fetch(`${this.url}${eventName}/${id}`, {
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
