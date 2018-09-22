// @flow
import * as React from 'react';
import { Actions, Scene, ActionConst, Lightbox } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

import AppLaunchContainer from 'containers/AppLaunch';
import BetsContainer from 'containers/Bets';
import LoginContainer from 'containers/Login';

/* Routes ==================================================================== */
export default Actions.create(
  <Lightbox>
    <Scene key="root" {...AppConfig.navbarProps} hideNavbar>
      <Scene
        hideNavBar
        key="splash"
        component={AppLaunchContainer}
      />

      {/* Main App */}
      <Scene key="main" {...AppConfig.navbarProps} hideNavbar>
        <Scene
          key="bets"
          {...AppConfig.navbarProps}
          component={BetsContainer}
        />
      </Scene>
    </Scene>

    <Scene
      key="login"
      {...AppConfig.navbarProps}
      title={AppConfig.appName}
      hideNavBar
      component={LoginContainer}
    />
  </Lightbox>,
);
