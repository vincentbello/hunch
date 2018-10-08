// @flow
import * as React from 'react';
import { Actions, ActionConst, Scene, Stack, Lightbox, Modal } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

import AppLaunchContainer from 'containers/AppLaunch';
import BetCardContainer from 'containers/BetCard';
import BetRequestsContainer from 'containers/BetRequests';
import BetsContainer from 'containers/Bets';
import CreateBetContainer from 'containers/CreateBet';
import InboxButtonContainer from 'containers/InboxButton';
import LoginContainer from 'containers/Login';
import NavButton from 'components/NavButton';

/* Routes ==================================================================== */
export default Actions.create(
  <Modal key="modal" hideNavBar>
    <Lightbox key="lightbox">
      <Stack key="root" {...AppConfig.navbarProps} hideNavBar>
        <Scene
          hideNavBar
          key="splash"
          component={AppLaunchContainer}
          initial
        />

        {/* Main App */}
        <Scene key="main" type={ActionConst.REPLACE} hideNavBar>
          <Scene
            key="bets"
            {...AppConfig.navbarProps}
            title="My Bets"
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
