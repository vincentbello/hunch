// @flow
import * as React from 'react';
import { Actions, Scene, ActionConst } from 'react-native-router-flux';

import AppConfig from 'constants/navigation';

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
      key="app"
      {...AppConfig.navbarProps}
      title={AppConfig.appName}
      hideNavBar={false}
      type={ActionConst.RESET}
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
