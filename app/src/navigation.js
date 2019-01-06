// @flow
import * as React from 'react';
import { Actions, ActionConst, Drawer, Scene, Stack, Lightbox, Modal, Tabs } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

import withUserListType from 'hocs/withUserListType';
import AppLaunchContainer from 'containers/AppLaunch';
import HunchCardContainer from 'containers/HunchCard';
import HunchRequestsContainer from 'containers/HunchRequests';
import HunchesContainer from 'containers/Hunches';
import CreateHunchContainer from 'containers/CreateHunch';
import DrawerContainer from 'containers/Drawer';
import FavoritesContainer from 'containers/Favorites';
import InboxButtonContainer from 'containers/InboxButton';
import LoginContainer from 'containers/Login';
import UserContainer from 'containers/User';
import UserCardContainer from 'containers/UserCard';
import NavButton from 'components/NavButton';
import TabbarIcon from 'components/TabbarIcon';
import TitleLogo from 'components/TitleLogo';

import Colors from 'theme/colors';
import AppSizes from 'theme/sizes';

/* Routes ==================================================================== */
export default Actions.create(
  <Modal key="modal" hideNavBar>
    <Lightbox key="lightbox">
      <Stack key="root" {...AppConfig.navbarProps} hideNavBar>
        <Scene
          hideNavBar
          key="splash"
          component={AppLaunchContainer}
        />

        {/* Main App */}
        <Scene key="main" type={ActionConst.REPLACE} hideNavBar>
          <Drawer
            key="settingsDrawer"
            contentComponent={DrawerContainer}
            hideDrawerButton
            drawerWidth={AppSizes.screen.widthThreeQuarters}
            drawerPosition="right"
          >
            <Tabs activeTintColor={Colors.brand.primary} key="tabbar" hideNavBar>
              <Scene key="hunchesTab" hideNavBar icon={props => <TabbarIcon focused={props.focused} name="dollar-sign" />} tabBarLabel="Hunches">
                <Scene
                  key="hunches"
                  {...AppConfig.navbarProps}
                  renderTitle={<TitleLogo />}
                  component={HunchesContainer}
                  renderLeftButton={(): React.Node => <NavButton iconName="plus" targetScene="createHunchModal" />}
                  renderRightButton={() => <InboxButtonContainer targetScene="requestedHunches" />}
                />

                <Scene
                  back
                  key="requestedHunches"
                  {...AppConfig.navbarProps}
                  title="My Hunch Requests"
                  component={HunchRequestsContainer}
                  renderBackButton={(): React.Node => <NavButton iconName="arrow-left" onClick={Actions.pop} />}
                />

                <Scene
                  back
                  key="hunchCard"
                  {...AppConfig.transparentNavbarProps}
                  component={HunchCardContainer}
                  renderBackButton={(): React.Node => <NavButton backgroundColor="rgba(0,0,0,0.3)" color={Colors.white} iconName="arrow-left" onClick={Actions.pop} />}
                />
              </Scene>
              <Scene key="friendsTab" icon={props => <TabbarIcon focused={props.focused} name="users" />} tabBarLabel="Friends">
                <Scene
                  key="friends"
                  title="My Friends"
                  component={withUserListType('FRIENDS')}
                  renderRightButton={() => <InboxButtonContainer targetScene="friendRequests" />}
                />
                <Scene
                  back
                  key="friendRequests"
                  title="Friend Requests"
                  component={withUserListType('FRIEND_REQUESTS')}
                  renderBackButton={(): React.Node => <NavButton iconName="arrow-left" onClick={Actions.pop} />}
                />
              </Scene>
              <Scene key="userTab" icon={props => <TabbarIcon focused={props.focused} name="user" />} tabBarLabel="Me">
                <Scene
                  key="user"
                  title="My Account"
                  component={UserContainer}
                  renderRightButton={(): React.Node => <NavButton iconName="settings" onClick={Actions.drawerOpen} />}
                />
                <Scene
                  back
                  key="favorites"
                  title="My Favorites"
                  component={FavoritesContainer}
                  renderBackButton={(): React.Node => <NavButton iconName="arrow-left" onClick={Actions.pop} />}
                />
              </Scene>
            </Tabs>
            <Scene
              back
              clone
              key="userCard"
              {...AppConfig.navbarProps}
              title="User"
              component={UserCardContainer}
              renderBackButton={(): React.Node => <NavButton iconName="arrow-left" onClick={Actions.pop} />}
            />
            <Scene
              back
              clone
              key="userFriends"
              {...AppConfig.navbarProps}
              component={withUserListType('FRIENDS')}
              renderBackButton={(): React.Node => <NavButton iconName="arrow-left" onClick={Actions.pop} />}
            />
          </Drawer>
        </Scene>
      </Stack>
    </Lightbox>

    <Scene
      key="createHunchModal"
      {...AppConfig.navbarProps}
      title="Create Hunch"
      leftTitle="Cancel"
      onLeft={Actions.pop}
      component={CreateHunchContainer}
    />

    <Scene
      key="loginModal"
      {...AppConfig.navbarProps}
      title={AppConfig.appName}
      hideNavBar
      component={LoginContainer}
    />
  </Modal>,
);
