import React from "react";
import {Text, View} from "react-native";

class ListEmpty extends React.Component {
  render() {
    return (
      <View style={styles.loading}>
        <Text style={styles.text}>The list is empty.</Text>
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
    color: 'gray',
    fontSize: 20,
  }
};

export default ListEmpty;