import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { NotificationListComponent } from '../NotificationListComponent';

export const NotificationPageComponent = () => {
  return (
    <Page themeId="tool">
      <Header title="Notifications" />
      <Content>
        <NotificationListComponent />
      </Content>
    </Page>
  );
};