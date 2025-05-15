import { debounce } from 'lodash';

type AnyFunc = (...args: any[]) => void;

export function createDebouncedAction(fn: AnyFunc, wait = 3000) { // Per ara, espera 3 segons
  return debounce((...args: any[]) => {
    console.log('Carregant...');
    try {
      fn(...args);
      console.log('Fet.');
    } catch (error) {
      console.log('Error a l\'acció debounced', error);
    }
  }, wait, {
    leading: true,
    trailing: false,
  });
}