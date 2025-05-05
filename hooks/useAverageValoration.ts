import { Valoration } from '@/constants/mocks/mockTypes';

import { useMemo } from 'react';

export default function useAverageValoration(valorations?: Valoration[]) {
  return useMemo(() => {
    if (!valorations || valorations.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = valorations.reduce((total, val) => total + val.value, 0);
    const average = parseFloat((sum / valorations.length).toFixed(1));
    
    return {
      average,
      count: valorations.length,
      formatted: `${average} (${valorations.length})`
    };
  }, [valorations]);
}