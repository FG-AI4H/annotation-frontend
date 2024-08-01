import { KanbanBoard } from '../../../../components';

export default function TaskManagement({ data }) {
  console.log(data);

  const mockTask = [
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178d94',
      status: 'IN_PROGRESS',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_adam',
      assignee_username: 'adam_annotator',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
      annotation_tasks: [
        {
          id: 'bc79321c-8517-447e-b0b2-f42b6919f33b',
          kind: 'SEMANTIC_SEGMENTATION',
          title: 'Tumor Segmentation',
          description: 'Update the existing annotations',
        },
      ],
    },
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178doa',
      status: 'COMPLETED',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_adam',
      assignee_username: 'adam_annotator',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
      annotation_tasks: [
        {
          id: 'bc79321c-8517-447e-b0b2-f42b6919f33b',
          kind: 'SEMANTIC_SEGMENTATION',
          title: 'Tumor Segmentation',
          description: 'Change the existing annotations',
        },
      ],
    },
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178d21',
      status: 'NOT_STARTED',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_khoa',
      assignee_username: 'dangkhoa',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
      annotation_tasks: [
        {
          id: 'bc79321c-8517-447e-b0b2-f42b6919f33b',
          kind: 'SEMANTIC_SEGMENTATION',
          title: 'Tumor Segmentation',
          description: 'Review the existing annotations',
        },
      ],
    },
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178diu',
      status: 'COMPLETED',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_khoa',
      assignee_username: 'dangkhoa',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
      annotation_tasks: [
        {
          id: '6a27ebd6-16da-42fa-9361-423bfa0d16bf',
          kind: 'SEMANTIC_SEGMENTATION',
          title: 'Tumor Segmentation',
          description: 'Correct the existing annotation',
        },
      ],
    },
  ];

  const mappingTask = (data) => {
    let completed = data?.filter((item) => item?.status === 'COMPLETED');
    let notStarted = data?.filter((item) => item?.status === 'NOT_STARTED');
    let inProgress = data?.filter((item) => item?.status === 'IN_PROGRESS');

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

  console.log(mappingTask(mockTask));

  return <KanbanBoard data={mappingTask(mockTask)} />;
}
