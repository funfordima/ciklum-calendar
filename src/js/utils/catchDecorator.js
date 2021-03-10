import Data from './data';
import { errorMsg, successMsg } from '../components/statusMsg';
import { message, MAIN_URL } from '../constants/constants';

const catchDecorator = () => async (fn, parentElement, ...args) => {
  const instanceData = new Data(MAIN_URL);

  try {
    const response = await instanceData[fn](...args);

    if (!response.ok) {
      throw new Error(`Could not fetch ${MAIN_URL}, status: ${response.status}`);
    }

    if (parentElement) {
      const msg = successMsg(message.success, parentElement);

      setTimeout(() => {
        parentElement.removeChild(msg);
      }, 2100);
    }

    return response;
  } catch (error) {
    const msg = errorMsg(error.message, parentElement);

    setTimeout(() => parentElement.removeChild(msg), 2000);

    return Promise.reject(error);
  }
};

export default catchDecorator;
