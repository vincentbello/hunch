// @flow
import * as React from 'react';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';

type Props = {
  focused: string,
  name: string,
};

const TabbarIcon = ({ focused, ...iconProps }: Props): React.Node => (
  <Icon color={focused ? Colors.brand.primary : Colors.textSecondary} size={20} {...iconProps} />
);

TabbarIcon.defaultProps = {
  focused: false,
};

export default TabbarIcon;
