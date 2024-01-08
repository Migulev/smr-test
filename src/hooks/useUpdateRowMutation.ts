import { Id, Mode } from '@/app/page.types';
import { updateRowInData } from '@/lib/utils';
import { updateRowAPI } from '@/services/smr';
import { SmrRowAPIRequest } from '@/services/smr.types';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

const useUpdateRowMutation = (
  data: SmrRowAPIRequest[],
  setData: Dispatch<SetStateAction<SmrRowAPIRequest[] | null>>,
  setMode: Dispatch<SetStateAction<Mode>>,
  setIdInEditState: Dispatch<SetStateAction<Id>>,
  setIdInMutation: Dispatch<SetStateAction<Id>>
) => {
  return useMutation({
    mutationFn: updateRowAPI,
    onMutate: (variables) => {
      const newData = updateRowInData(data, variables.rowId, { ...variables });
      setData(newData);
      setIdInMutation(variables.rowId);
      setMode(Mode.Pending);
      setIdInEditState(null);
    },
    onSuccess: () => {
      setIdInEditState(null);
      setMode(Mode.Viewing);
    },
    onError: (_, variables) => {
      setMode(Mode.Editing);
      setIdInEditState(variables.rowId);
      alert('данные не сохранились');
    },
    onSettled: () => {
      setIdInMutation(null);
    },
  });
};

export default useUpdateRowMutation;
