import { useEffect, useState } from 'react';
import { KanbanBoard } from '../../../../components';
import useFetch from '../../../../hooks/useFetch';
import { getTaskByCampaign } from '../../../../api/task.service';
import { TASK_STATUS } from '../../../../common/constants';

export default function TaskManagement({ data }) {
  console.log(data);

  const [tasks, setTasks] = useState([]);
  const { axiosBase } = useFetch();

  useEffect(() => {
    (async () => {
      const res = await getTaskByCampaign(
        // data?.id,
        '02725a0e-9c72-43bb-b88d-5c2819c5ddf3',
        axiosBase
      );
      setTasks(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  const mappingTask = (data) => {
    let completed = data?.filter(
      (item) => item?.task_status === TASK_STATUS.COMPLETED
    );
    let notStarted = data?.filter(
      (item) => item?.task_status === TASK_STATUS.INITIALIZED
    );
    let inProgress = data?.filter(
      (item) => item?.task_status === TASK_STATUS.IN_PROGRESS
    );

    completed = completed?.map((item) => ({
      ...item?.annotation_tasks[0],
      ...item,
      author: item?.assignee_username,
    }));
    notStarted = notStarted?.map((item) => ({
      ...item?.annotation_tasks[0],
      ...item,
      author: item?.assignee_username,
    }));
    inProgress = inProgress?.map((item) => ({
      ...item?.annotation_tasks[0],
      ...item,
      author: item?.assignee_username,
    }));

    return { completed, notStarted, inProgress, review: [] };
  };

  return <KanbanBoard data={mappingTask(tasks)} />;
}
