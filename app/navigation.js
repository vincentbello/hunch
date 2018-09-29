// @flow
import * as React from 'react';
import { Actions, Scene, Stack, ActionConst, Lightbox } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

import AppLaunchContainer from 'containers/AppLaunch';
import BetsContainer from 'containers/Bets';
import LoginContainer from 'containers/Login';

/* Routes ==================================================================== */
export default Actions.create(
  <Lightbox hideNavbar>
    <Stack key="root" {...AppConfig.navbarProps} hideNavbar>
      <Scene
        hideNavBar
        key="splash"
        component={AppLaunchContainer}
      />

      {/* Main App */}
      {/* <Scene key="main" {...AppConfig.navbarProps} hideNavbar> */}
      <Scene
        key="main"
        {...AppConfig.navbarProps}
        title="My Bets"
        component={BetsContainer}
        hideNavbar
      />
      {/* </Scene> */}
    </Stack>

    <Scene
      key="login"
      {...AppConfig.navbarProps}
      title={AppConfig.appName}
      hideNavBar
      component={LoginContainer}
    />
  </Lightbox>,
);
