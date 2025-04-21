import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import {
  Progress,
  ResponseErrorPanel,
  Select,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { notificationsApiRef } from '../../api';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Notification } from '../../api/types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const NotificationListComponent = () => {
  const allChannelsKey = 'all-channels';
  const [selectedChannel, setSelectedChannel] = useState(allChannelsKey);
  const config = useApi(configApiRef);
  const notificationsApi = useApi(notificationsApiRef);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadData = () => {
    setError(null);
    setLoading(true);
    notificationsApi
      .getNotifications()
      .then(result => {
        setLoading(false);
        setNotifications(result);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error || !notifications) {
    return <ResponseErrorPanel error={error ?? new Error('No data found')} />;
  }

  const columns: TableColumn[] = [
    {
      title: 'Time',
      field: 'timestamp',
      type: 'string',
      render: (row: any, _) => new Date(row['timestamp']).toLocaleString(),
    },
    {
      title: 'Message',
      field: 'message',
      type: 'string',
      render: (row: any, _) => {
        let html = DOMPurify.sanitize(marked.parse(row['message']) as string);
        // ugly fix to add link highlighting
        html = html.replaceAll(
          '<a',
          '<a target="_blank" style="text-decoration: underline; color: blue"',
        );
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      },
    },
    { title: 'Channel', field: 'channel' },
    { title: 'Origin', field: 'origin' },
  ];

  const channels: string[] = [];
  notifications.forEach(notification => {
    if (!channels.includes(notification.channel)) {
      channels.push(notification.channel);
    }
  });
  return (
    <Grid container direction="row">
      <Grid item xs={2}>
        <Select
          label="Channel"
          items={[
            { label: 'All Channels', value: allChannelsKey },
            ...channels.map(c => ({
              label: c,
              value: c,
            })),
          ]}
          selected={selectedChannel.toLocaleLowerCase('en-US')}
          onChange={value => setSelectedChannel(String(value))}
        />
        <Button style={{ width: '100%' }} onClick={() => loadData()}>
          <RefreshIcon />
        </Button>
      </Grid>
      <Grid item xs={10}>
        <Table
          options={{ paging: false, sorting: true }}
          data={notifications.filter(
            v =>
              !selectedChannel ||
              selectedChannel === allChannelsKey ||
              v.channel === selectedChannel,
          )}
          columns={columns}
          title="Notifications"
          emptyContent={
            <div style={{ textAlign: 'center' }}>
              <h2>No notifications to display.</h2>
              <p>
                Send notifications to{' '}
                <code>{config.getString('app.baseUrl')}/api/notifications</code>
                .
              </p>
            </div>
          }
        />
      </Grid>
    </Grid>
  );
};