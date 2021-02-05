export default class Data {
  static sendData(url, data) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .catch((err) => console.log(err.message));
  }

  static async getData(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  }
}
