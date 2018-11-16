import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { AsyncStorage } from 'react-native';
import { API_URL } from 'react-native-dotenv';

const httpLink = new HttpLink({ uri: `${API_URL}/api` });

const authLink = setContext(async (_, context) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken === null) return context;
  return {
    ...context,
    headers: {
      ...context.headers,
      'x-auth-token': accessToken,
    },
  };
});

export default authLink.concat(httpLink);
