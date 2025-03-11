import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

const PostDetails = () => {
  const { postId } = useLocalSearchParams();

  return (
    <View>
      <Text>Post ID: {postId}</Text>
    </View>
  );
};

export default PostDetails;
