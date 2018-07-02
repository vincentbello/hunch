// @flow
import * as React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

import LoginContainer from 'containers/Login';

/* Routes ==================================================================== */
export default Actions.create(
  <Scene key="root" {...AppConfig.navbarProps}>
    {/* <Scene
      hideNavBar
      key="splash"
      component={AppLaunch}
    /> */}

    {/* Main App */}
    <Scene
      key="login"
      {...AppConfig.navbarProps}
      title={AppConfig.appName}
      hideNavBar
      type={ActionConst.RESET}
      component={LoginContainer}
    >

      {/* <Scene
        key="search"
        {...AppConfig.navbarProps}
        navBar={SearchQueryContainer}
        component={SearchResultsContainer}
      /> */}
    </Scene>
  </Scene>,
);
