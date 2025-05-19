import { Valoration } from '@/constants/mocks/mockTypes';

import { useMemo } from 'react';


export default function getAverageValoration(valorations: Valoration[]) {
  const count = valorations?.length || 0;
  const average = count > 0
    ? valorations.reduce((sum, v) => sum + v.value, 0) / count
    : 0;
  return { average, count };
}




/*
export default function useAverageValoration(valorations?: Valoration[]) {
  if (!valorations || valorations.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = 2;//valorations.reduce((total, val) => total + val.value, 0);
    const average = parseFloat((sum / valorations.length).toFixed(1));
    
    return {
      average,
      count: valorations.length,
      //formatted: `${average} (${valorations.length})`
    };
}
    */
/*
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
*/