// @flow
import * as React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

import BetsContainer from 'containers/Bets';
import LoginContainer from 'containers/Login';

/* Routes ==================================================================== */
export default Actions.create(
  <Scene key="root" {...AppConfig.navbarProps}>
    <Scene key="auth">
      <Scene
        key="login"
        {...AppConfig.navbarProps}
        title={AppConfig.appName}
        hideNavBar
        type={ActionConst.RESET}
        component={LoginContainer}
      />
    </Scene>

    {/* Main App */}
    <Scene key="main" {...AppConfig.navbarProps} hideNavbar>
      <Scene
        key="bets"
        {...AppConfig.navbarProps}
        component={BetsContainer}
      />
      {/* <Scene
        key="search"
        {...AppConfig.navbarProps}
        navBar={SearchQueryContainer}
        component={SearchResultsContainer}
      /> */}
    </Scene>
  </Scene>,
);
