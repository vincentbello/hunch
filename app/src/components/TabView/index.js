import * as React from 'react';
import { PagerPan, TabBar, TabView } from 'react-native-tab-view';
import { StyleSheet } from 'react-native';

import Colors from 'theme/colors';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  indicator: {
    backgroundColor: Colors.brand.primary,
  },
  label: {
    color: Colors.brand.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  label_small: {
    fontSize: 10,
    textAlign: 'center',
  },
  tab: {
    padding: 4,
  },
  tab_small: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 0,
    paddingRight: 0,
  },
  tab_scrollable: {
    width: 72,
  },
});

const CustomTabView = ({ small, scrollable, ...tabViewProps }) => (
  <TabView
    renderPager={props => <PagerPan {...props} swipeEnabled={false} />}
    renderTabBar={props => (
      <TabBar
        {...props}
        scrollEnabled={scrollable}
        indicatorStyle={styles.indicator}
        labelStyle={[styles.label, small && styles.label_small]}
        tabStyle={[styles.tab, small && styles.tab_small, scrollable && styles.tab_scrollable]}
        style={styles.bar}
        getLabelText={({ route }) => (small ? route.title : route.title.toUpperCase())}
      />
    )}
    {...tabViewProps}
  />
);

CustomTabView.defaultProps = {
  scrollable: false,
  small: false,
};
CustomTabView.displayName = 'TabView';

export default CustomTabView;
