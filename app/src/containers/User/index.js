// @flow
import * as React from 'react';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import UserCard from 'components/UserCard';

const UserContainer = ({ currentUser }: CurrentUserProps): React.Node => <UserCard isCurrent user={currentUser} />;

UserContainer.displayName = 'UserContainer';
export default withCurrentUser(UserContainer);
