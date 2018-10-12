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
    fontSize: 11,
    textAlign: 'center',
  },
  tab: {
    padding: 4,
  },
});

const CustomTabView = ({ small, ...tabViewProps }) => (
  <TabView
    renderPager={props => <PagerPan {...props} swipeEnabled={false} />}
    renderTabBar={props => (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        labelStyle={[styles.label, small && styles.label_small]}
        tabStyle={styles.tab}
        style={styles.bar}
        getLabelText={({ route }) => (small ? route.title : route.title.toUpperCase())}
      />
    )}
    {...tabViewProps}
  />
);

CustomTabView.displayName = 'TabView';

export default CustomTabView;
