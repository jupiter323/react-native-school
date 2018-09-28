import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class AnswerBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
      description: '',
      convoKey: '',
      userName: '',
      sellerName: '',
      previousMessage: false,
      isModalVisible: false,
      upButtonPressed: false,
      downButtonPressed: false,
    }

    console.log(JSON.stringify("answerblock props " + JSON.stringify(props)));
  }

  openConsultantScreen() {
    console.log('pressed ');
    this.props.purchaseItem(this.props.jedi);
  }

  onPressUpvote =async() => {
    console.log("up");

    if (this.state.upButtonPressed) {
      await this.setState({ upButtonPressed: !this.state.upButtonPressed});
      this.reverseUpvote();
    } else {
      await this.setState({ upButtonPressed: !this.state.upButtonPressed});
      this.storeUpvote();
    }
  }

  onPressDownvote =async() => {
    console.log("down");
    if (this.state.downButtonPressed) {
      await this.setState({ downButtonPressed: !this.state.downButtonPressed});
      this.reverseDownvote();
    } else {
      await this.setState({ downButtonPressed: !this.state.downButtonPressed});
      this.storeDownvote();
    }
  }

  storeUpvote =() => {
      var upvotes;
      var downvotes;
      var total;
      firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
      .child(this.props.jedi.key).on('value',(snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      upvotes = childData.upvotes + 1;
      downvotes = childData.downvotes;
      total = upvotes - downvotes;
    });

    firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
    .child(this.props.jedi.key).update({
      upvotes: upvotes,
      downvotes: downvotes,
      totalUpvotes: total,
    });
  }

  reverseUpvote =() => {
    var upvotes;
    var downvotes;
    var total;
    firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
    .child(this.props.jedi.key).on('value',(snapshot) => {
    var childKey = snapshot.key;
    var childData = snapshot.val();
    upvotes = childData.upvotes - 1;
    downvotes = childData.downvotes;
    total = upvotes - downvotes;
  });

  firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
  .child(this.props.jedi.key).update({
    upvotes: upvotes,
    downvotes: downvotes,
    totalUpvotes: total,
  });
  }

  storeDownvote =() => {
      var upvotes;
      var downvotes;
      var total;
      firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
      .child(this.props.jedi.key).on('value',(snapshot) => {
      var childKey = snapshot.key;
      var childData = snapshot.val();
      upvotes = childData.upvotes;
      downvotes = childData.downvotes + 1;
      total = upvotes - downvotes;
    });

    firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
    .child(this.props.jedi.key).update({
      upvotes: upvotes,
      downvotes: downvotes,
      totalUpvotes: total,
    });
  }

  reverseDownvote =() => {
    var upvotes;
    var downvotes;
    var total;
    firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
    .child(this.props.jedi.key).on('value',(snapshot) => {
    var childKey = snapshot.key;
    var childData = snapshot.val();
    upvotes = childData.upvotes;
    downvotes = childData.downvotes - 1;
    total = upvotes - downvotes;
  });

  firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
  .child(this.props.jedi.key).update({
    upvotes: upvotes,
    downvotes: downvotes,
    totalUpvotes: total,
  });
  }


  render() {
          return (
            <TouchableOpacity onPress={() => this.openConsultantScreen()}>
              <View style={styles.cardView}>
                <Card style={styles.card}
                    title={this.props.jedi.answer}>
                    <Text style={styles.textStyles}>
                    Author: {this.props.jedi.author}
                    </Text>
                    <Text style={styles.textStyles}>
                    Upvotes: {this.props.jedi.totalUpvotes}
                    </Text>
                    <Text style={styles.textStyles}>
                    Upvotes: {this.props.jedi.key}
                    </Text>
                    <Text style={styles.textStyles}>
                    Upvotes: {this.props.forumLocation}
                    </Text>
                    <View style={styles.ratingButtons}>
                    <Feather style={this.state.upButtonPressed ? styles.buttonPressed : styles.buttonNotPressed}
                      name="arrow-up"
                      size={Metrics.icons.medium}
                      color={'black'}
                      onPress={() => this.onPressUpvote()}
                    />
                    <Feather style={this.state.downButtonPressed ? styles.buttonPressed : styles.buttonNotPressed}
                      name="arrow-down"
                      size={Metrics.icons.medium}
                      color={'black'}
                      onPress={() => this.onPressDownvote()}
                    />
                    </View>
                    </Card>

              </View>
            </TouchableOpacity>
            );
  }
}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
    borderRadius: Metrics.buttonRadius,
  },
  pictureView: {
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  picture: {
    height: Metrics.images.large,
    width: Metrics.images.large,
    borderRadius: Metrics.images.large * 0.5
  },
  pictureDetails: {
    flexDirection: 'column',
    marginLeft: Metrics.marginHorizontal,
    marginRight: Metrics.marginHorizontal,
  },
  jediRowItem: {
    marginTop: Metrics.marginVertical,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  ratingButtons: {
    flexDirection: 'row',
  },
  buttonPressed: {
    color: '#5A3DC9',
  },
  buttonNotPressed: {
    color: 'black',
  },
});
