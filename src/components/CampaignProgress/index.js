import { Grid, Typography } from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import { uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import DataTable from '../DataTable';
import { getTaskByCampaign } from '../../api/task.service';
import { TASK_STATUS } from '../../common/constants';

const CampaignProgress = (props) => {
  const [tasks, setTasks] = useState([]);
  const { axiosBase } = useFetch();

  useEffect(() => {
    (async () => {
      const res = await getTaskByCampaign(
        // props?.campaign?.id,
        '02725a0e-9c72-43bb-b88d-5c2819c5ddf3',
        axiosBase
      );
      setTasks(res);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.campaign?.id]);

  const columns = [
    { id: 'assignee_username', fieldName: 'Assignee' },
    { id: 'completed', fieldName: 'Completed' },
    { id: 'notStarted', fieldName: 'Not started' },
    { id: 'inProgress', fieldName: 'In progress' },
  ];

  const mappingData = (data) => {
    let result = [];
    let arrUser = data?.map((item) => item?.assignee);
    arrUser = uniqBy(arrUser);

    arrUser.forEach((item) => {
      const filteredAssignee = data?.filter((task) => task?.assignee === item);
      const completedTask = filteredAssignee?.filter(
        (item) => item?.task_status === TASK_STATUS.COMPLETED
      );
      const notStartedTask = filteredAssignee?.filter(
        (item) => item?.task_status === TASK_STATUS.INITIALIZED
      );
      const inProgressTask = filteredAssignee?.filter(
        (item) => item?.task_status === TASK_STATUS.IN_PROGRESS
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
    return result;
  };

  const data = [
    {
      id: 'Completed',
      label: 'Completed',
      value:
        tasks?.filter((item) => item?.task_status === TASK_STATUS.COMPLETED)
          ?.length || 0,
      color: 'hsl(219, 70%, 50%)',
    },
    {
      id: 'Not started',
      label: 'Not started',
      value:
        tasks?.filter((item) => item?.task_status === TASK_STATUS.INITIALIZED)
          ?.length || 0,
      color: 'hsl(219, 70%, 50%)',
    },
    {
      id: 'In progress',
      label: 'In progress',
      value:
        tasks?.filter((item) => item?.task_status === TASK_STATUS.IN_PROGRESS)
          ?.length || 0,
      // color: 'hsl(219, 70%, 50%)',
    },
  ];

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

      <Grid container columnGap={1} rowGap={2} justifyContent={'space-between'}>
        <Grid
          item
          xs={11.7}
          sm={5.7}
          md={5.7}
          sx={{
            height: '400px',
            backgroundColor: '#1e1e1e',
            borderRadius: '10px !important',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          }}
        >
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            arcLabel={(e) => (e?.value === 0 ? '' : e?.value)}
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
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 40,
                itemsSpacing: 10,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
              },
            ]}
          />
        </Grid>

        <Grid
          item
          xs={11.7}
          sm={5.7}
          md={5.7}
          sx={{
            height: '100%',
          }}
        >
          <DataTable
            columns={columns}
            data={mappingData(tasks)}
            maxHeight='400px'
          />
        </Grid>
      </Grid>
    </div>
  );
};
export default CampaignProgress;
