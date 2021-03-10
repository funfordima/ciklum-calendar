import create from '../utils/create';

const successMsg = (msg, parentElement) => create('div', 'success-msg', msg, parentElement);

const errorMsg = (msg, parentElement) => create('div', 'error-msg', msg, parentElement);

export { successMsg, errorMsg };
