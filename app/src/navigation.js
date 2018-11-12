// @flow
import * as React from 'react';
import { Actions, ActionConst, Scene, Stack, Lightbox, Modal, Tabs } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Feather';

import AppConfig from 'constants/navigation';

import AppLaunchContainer from 'containers/AppLaunch';
import BetCardContainer from 'containers/BetCard';
import BetRequestsContainer from 'containers/BetRequests';
import BetsContainer from 'containers/Bets';
import CreateBetContainer from 'containers/CreateBet';
import InboxButtonContainer from 'containers/InboxButton';
import LoginContainer from 'containers/Login';
import LogoutButtonContainer from 'containers/LogoutButton';
import UserContainer from 'containers/User';
import NavButton from 'components/NavButton';
import TabbarIcon from 'components/TabbarIcon';

import Colors from 'theme/colors';

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
          <Tabs activeTintColor={Colors.brand.primary} key="tabbar" hideNavBar>
            <Scene key="betsTab" hideNavBar icon={props => <TabbarIcon focused={props.focused} name="dollar-sign" />} tabBarLabel="Bets">
              <Scene
                key="bets"
                {...AppConfig.navbarProps}
                title="HunchCard"
                titleStyle={{ fontFamily: 'VeteranTypewriter', fontSize: 24, transform: [{ scaleY: 0.9 }] }}
                component={BetsContainer}
                renderLeftButton={(): React.Node => <NavButton iconName="plus" targetScene="createBetModal" />}
                renderRightButton={<InboxButtonContainer />}
              />

              <Scene
                key="requestedBets"
                {...AppConfig.navbarProps}
                title="My Bet Requests"
                component={BetRequestsContainer}
              />

              <Scene
                key="betCard"
                {...AppConfig.navbarProps}
                title="Bet"
                component={BetCardContainer}
              />
            </Scene>
            <Scene key="userTab" icon={props => <TabbarIcon focused={props.focused} name="user" />} tabBarLabel="Me">
              <Scene
                key="user"
                title="My Account"
                component={UserContainer}
                renderRightButton={() => <LogoutButtonContainer />}
              />
            </Scene>
          </Tabs>
        </Scene>
      </Stack>
    </Lightbox>

    <Scene
      key="createBetModal"
      {...AppConfig.navbarProps}
      title="Create Bet"
      leftTitle="Cancel"
      onLeft={Actions.pop}
      component={CreateBetContainer}
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
