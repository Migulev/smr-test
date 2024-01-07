import { Id, Mode } from '@/app/page.types';
import { updateIdInData, updateRowInData } from '@/lib/utils';
import { createRowAPI } from '@/services/smr';
import { SmrRowAPIRequest } from '@/services/smr.types';
import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

const useCreateRowMutation = (
  data: SmrRowAPIRequest[],
  idInEditState: Id,
  idInMutation: Id,
  setData: Dispatch<SetStateAction<SmrRowAPIRequest[]>>,
  setMode: Dispatch<SetStateAction<Mode>>,
  setIdInEditState: Dispatch<SetStateAction<Id>>,
  setIdInMutation: Dispatch<SetStateAction<Id>>
) => {
  return useMutation({
    mutationFn: createRowAPI,
    onMutate: (variables) => {
      const tempId =
        idInEditState === null ? new Date().valueOf() : idInEditState;
      const newData = updateRowInData(data, tempId, { ...variables });
      setData(newData);
      setMode(Mode.Pending);
      setIdInMutation(tempId);
      setIdInEditState(null);
    },
    onSuccess: (dataAPI) => {
      const newData = updateIdInData(data, idInMutation, dataAPI.current.id);
      setData(newData);
      setMode(Mode.Viewing);
    },
    onError: () => {
      const newData = updateIdInData(data, idInMutation, null);
      setData(newData);
      setMode(Mode.Adding);
      alert('данные не сохранились');
    },
    onSettled: () => {
      setIdInMutation(null);
    },
  });
};

export default useCreateRowMutation;
