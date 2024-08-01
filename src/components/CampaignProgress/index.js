import { Typography } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import React, { useState } from 'react';
import DataTable from '../DataTable';
import { uniqBy } from 'lodash';

const CampaignProgress = (props) => {
  const [campaign, setCampaign] = useState(props.campaign);

  const data = [
    {
      id: 'Completed',
      label: 'Completed',
      value: 10,
      // color: 'hsl(225, 70%, 50%)',
    },
    {
      id: 'Not started',
      label: 'Not started',
      value: 11,
      // color: 'hsl(116, 70%, 50%)',
    },
    {
      id: 'In progress',
      label: 'In progress',
      value: 30,
      // color: 'hsl(219, 70%, 50%)',
    },
  ];

  const columns = [
    { id: 'assignee_username', fieldName: 'Assignee' },
    { id: 'completed', fieldName: 'Completed' },
    { id: 'notStarted', fieldName: 'Not started' },
    { id: 'inProgress', fieldName: 'In progress' },
  ];

  const tasks = [
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
    },
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178d94',
      status: 'COMPLETED',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_adam',
      assignee_username: 'adam_annotator',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
    },
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178d94',
      status: 'NOT_STARTED',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_khoa',
      assignee_username: 'dangkhoa',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
    },
    {
      id: '0b2fb698-6e1d-4682-a986-78b115178d94',
      status: 'COMPLETED',
      kind: 'CREATE',
      read_only: false,
      assignee: '0df5d02a-9ae1-4f65-9f80-abae2c9d57aa_khoa',
      assignee_username: 'dangkhoa',
      campaign: null,
      campaign_status: null,
      campaign_task_kind: null,
    },
  ];

  const mappingData = (data) => {
    let result = [];
    let arrUser = data?.map((item) => item?.assignee);
    arrUser = uniqBy(arrUser);

    arrUser.forEach((item) => {
      const filteredAssignee = data?.filter((task) => task?.assignee === item);
      const completedTask = filteredAssignee?.filter(
        (item) => item?.status === 'COMPLETED'
      );
      const notStartedTask = filteredAssignee?.filter(
        (item) => item?.status === 'NOT_STARTED'
      );
      const inProgressTask = filteredAssignee?.filter(
        (item) => item?.status === 'IN_PROGRESS'
      );

      result.push({
        assignee: filteredAssignee?.[0]?.assignee,
        assignee_username: filteredAssignee?.[0]?.assignee_username,
        completed: completedTask?.length,
        notStarted: notStartedTask?.length,
        inProgress: inProgressTask?.length,
        completedTask,
        inProgressTask,
        notStartedTask,
      });
    });
    console.log(result);
    return result;
  };

  return (
    <div style={{ color: 'black' }}>
      <Typography
        gutterBottom
        variant='h5'
        component='div'
        sx={{ color: 'white !important', paddingBottom: '20px' }}
      >
        Campaign Progression
      </Typography>

      <div style={{ display: 'flex', height: '400px', gap: '10px' }}>
        <div
          style={{
            height: '400px',
            backgroundColor: '#1e1e1e',
            borderRadius: 10,
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            width: '50%',
          }}
        >
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            enableArcLinkLabels={false}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            legends={[
              {
                anchor: 'left',
                direction: 'column',
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 10,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
                    },
                  },
                ],
              },
            ]}
          />
        </div>

        <div
          style={{
            width: '50%',
            height: '100%',
          }}
        >
          <DataTable
            columns={columns}
            data={mappingData(tasks)}
            maxHeight='400px'
          />
        </div>
      </div>
    </div>
  );
};
export default CampaignProgress;
