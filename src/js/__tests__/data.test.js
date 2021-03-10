jest.mock('axios');

import Data from '../utils/data';
import fetchMock from 'fetch-mock';
import { MAIN_URL } from '../constants/constants';
import axios from 'axios';

describe('Data: test CRUD', () => {
  let data;

  beforeAll(() => {
    data = new Data(MAIN_URL);
  });

  test('check status code 200', async () => {
    fetchMock.mock(MAIN_URL + 'members', 200);
    const res = await fetch(MAIN_URL + 'members');
    expect(res.ok).toBe(true);
    fetchMock.restore();
  });

  test('it returns an array of users', async () => {
    const expected = [
      { id: "f177cee53c8e", isActive: true, name: "Ivan" },
      { id: "f177cee7ce58", isActive: true, name: "Nick" },
      { id: "f177ceeee590", isActive: true, isAdmin: true, name: "Tamara" },
    ];

    fetchMock.get(MAIN_URL + 'members', JSON.stringify(expected));

    const response = await data.getData('members');
    const result = await response.json();

    expect(result).toMatchObject(expected);
  });

  test('should fetch successfully data from an API', async () => {
    const members = [
      { id: "f177cee53c8e", isActive: true, name: "Ivan" },
      { id: "f177cee7ce58", isActive: true, name: "Nick" },
      { id: "f177ceeee590", isActive: true, isAdmin: true, name: "Tamara" }
    ];
    const response = { data: members, id: 'be324ebb-8818-4cca-be2b-e418317a8354' };

    axios.get.mockResolvedValue(response);

    const res = await data.getData('members');
    const json = await res.json();
    expect(json).toEqual(members);
  });
});

describe('class Data should work', () => {
  let fn;
  let data;
  const members = [
    { id: "f177cee53c8e", isActive: true, name: "Ivan" },
    { id: "f177cee7ce58", isActive: true, name: "Nick" },
    { id: "f177ceeee590", isActive: true, isAdmin: true, name: "Tamara" }
  ];

  beforeEach(() => {
    fn = jest.fn();
    data = new Data(MAIN_URL);
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  test('Data.getData() method should work', async () => {
    const getData = async () => {
      await data.getData('members');
      fn();
    };
    await getData();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('Data.sendData method should work', () => {
    const responseBody = { response: 'data send from the server' };

    fetchMock.once(MAIN_URL + 'members', {
      status: 200,
      body: JSON.stringify(responseBody),
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
      sendAsJson: false
    }, { method: 'POST' });

    data.sendData('members', { data: 'Sent payload' })
      .then(function (res) {
        expect(res.status).toEqual(200);
        return res.json();
      })
      .then(function (json) {
        console.log(json);
        expect(JSON.parse(json)).toEqual(responseBody);

        done();
      });
  });

  test('Data.putData method should work', () => {
    const resp = { response: 'data from the server' };
    const id = '9ba607bf-b59f-4517-8fbe-b21b421d2e78';

    fetchMock.mock(MAIN_URL + 'members/' + id, {
      status: 200,
      body: JSON.stringify(resp),
      statusText: 'OK',
      headers: { 'Content-type': 'application/json; charset=utf-8' },
      method: 'PUT'
    });

    data.putData('members', { data: 'Sent payload' }, id)
      .then(function (res) {
        expect(res.status).toEqual(200);
        fn();
        return res.json();
      })
      .then(function (json) {
        console.log(json);
        expect(JSON.parse(json)).toEqual(resp);
        expect(fn).toHaveBeenCalledTimes(1);
        done();
      });
  });
});
