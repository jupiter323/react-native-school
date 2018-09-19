import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

class Loading extends React.Component {
  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large"/>
        <Text style={styles.text}>Give it about 20 secs.{'\n'}Gotta let the magic happen.</Text>
      </View>
    );
  }
}

const styles = {
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
};

export default Loading;
