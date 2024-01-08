import { Id, Mode } from '@/app/page.types';
import { deleteRowInData } from '@/lib/utils';
import { deleteRowAPI } from '@/services/smr';
import { SmrRowAPIRequest } from '@/services/smr.types';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

const useDeleteRowMutation = (
  data: SmrRowAPIRequest[],
  setData: Dispatch<SetStateAction<SmrRowAPIRequest[] | null>>,
  setMode: Dispatch<SetStateAction<Mode>>
) => {
  return useMutation({
    mutationFn: deleteRowAPI,
    onMutate: (variables: Id) => {
      setMode(Mode.Pending);
      const newData = deleteRowInData(data, variables);
      setData(newData);
    },
    onError: () => {
      alert('Удаление не произошло. Страница была перезагружена');
      window.location.reload();
    },
    onSettled: () => {
      setMode(Mode.Viewing);
    },
  });
};

export default useDeleteRowMutation;
