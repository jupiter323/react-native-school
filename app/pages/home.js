import React, { Component} from 'react';
import { StyleSheet, Text, View, Platform, TouchableHighlight} from 'react-native';
import { StackNavigator } from 'react-navigation';


export default class Home extends React.Component {


static navigationOptions = {
  title: 'MoveItMoveIt',
};

  onPressMoving() {
    console.log("Moving");
  }
  onPressSelling() {
    console.log("selling");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container} >

        <View style = {{flex: 1}}>

          <TouchableHighlight
            style= {styles.movingView}
            onPress={() => navigate('Moving')}>
              <View>
              <Text style = {styles.movingText}>Moving</Text>
              </View>
            </TouchableHighlight>

          <TouchableHighlight
            style={styles.buyingView}
            onPress={() => navigate('Buyers')}>
              <View>
              <Text style = {styles.buyingText}>Buying</Text>
              </View>
          </TouchableHighlight>

          <TouchableHighlight
            style= {styles.sellingView}
            onPress={() => navigate('Sellers')}>
              <View>
              <Text style = {styles.sellingText}>Selling</Text>
              </View>
          </TouchableHighlight>


          </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  movingView: {
    flex: 1,
    backgroundColor: '#e0a8f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  movingText: {
    color: 'white',
    fontSize: 40,
    alignItems: 'center',
    padding: 26,
  },
  buyingView: {
    flex: 1,
    backgroundColor: '#e0a8f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyingText: {
    color: 'white',
    fontSize: 40,
    //fontFamily: 'lucida grande',
    padding: 26,
  },
  sellingView: {
    flex: 1,
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellingText: {
    color: 'white',
    fontSize: 40,
    padding: 26,
  },
});
