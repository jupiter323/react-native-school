import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage, TextInput } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import ReadMore from 'react-native-read-more-text';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar, Avatar } from 'react-native-elements'
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
      totalVotes: 0,
      upVotes : 0,
      downVotes : 0,
      voted : false,
    }
  }

  componentWillMount() {
    this.restoreVote();
  }
  openConsultantScreen() {
    console.log('pressed ');
    this.props.purchaseItem(this.props.jedi);
  }

  onPressUpvote =async() => {
    if(!this.state.voted){
      console.log("up");
      await this.setState({voted : true});
      this.saveVote("up");
    }    
    // if (this.state.upButtonPressed) {
    //   await this.setState({ upButtonPressed: !this.state.upButtonPressed});
    //   this.reverseUpvote();
    // } else {
    //   await this.setState({ upButtonPressed: !this.state.upButtonPressed});
    //   this.storeUpvote();
    // }
  }

  onPressDownvote =async() => {
    if(!this.state.voted){
      console.log("down");
      await this.setState({voted : true});
      this.saveVote("down");
    }    
  }
    
  openAnswerScreen() {

    console.log('pressed ');
    this.props.purchaseItem(this.props.jedi);
  }
  saveVote = (val) => {
    firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
    .child(this.props.jedi.key).child('voted').child(firebase.auth().currentUser.uid).set(
      { val : val}
    );
  }
  restoreVote = async() => {
    await firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
    .child(this.props.jedi.key).child('voted').on('value',async(snapshots)=>{
      if(snapshots.hasChild(firebase.auth().currentUser.uid)){
        await this.setState({voted : true});
      } else await this.setState({voted: false});
      let upVotes = 0;
      let downVotes = 0;
      await this.setState({totalVotes : snapshots.numChildren()});
      snapshots.forEach(snapshot=>{
        let result = snapshot.val();
        if(result.val=="up"){
          upVotes++;
        } else if(result.val=="down") {
          downVotes++;
        }
      });
      await firebase.database().ref('forum').child(this.props.forumLocation).child('answers')
      .child(this.props.jedi.key).update({
        upvotes : upVotes, downvotes : downVotes, totalUpvotes : upVotes-downVotes
      })
      await this.setState({upVotes : upVotes, downVotes : downVotes})
    })
  }

  imageButton(){
    if(this.props.jedi.profileImage){
      return(
        <Avatar
          size="large"
          source={{uri : this.props.jedi.profileImage}}
          activeOpacity={0.7}
          rounded
        />
      );
    } else 
      return(
        <Avatar
          size="large"
          source={Images.profile}
          activeOpacity={0.7}
          rounded
        />);
  }



  render() {
    return (
      <TouchableOpacity  onPress={() => this.openAnswerScreen()}>
        <View style={styles.cardView}>
          <Card style={styles.card}>
            <View style={{flexDirection : 'row'}}>
              {this.imageButton()}
              <Text style={{fontSize : 15, marginLeft :20, fontWeight : 'bold', lineHeight : 30}}>{this.props.jedi.author}</Text>
            </View>
            <View style={{marginTop :10}}> 
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={this._renderTruncatedFooter}
                renderRevealedFooter={this._renderRevealedFooter}
                onReady={this._handleTextReady}>
                <Text style={styles.cardText}>
                  {this.props.jedi.answer}
                </Text>
              </ReadMore>
            </View>
              <Text style={styles.textStyles}>
              {/* totalUpvotes: {this.state.upVotes - this.state.downVotes}  */}
              <FontAwesome style={this.state.voted ? styles.buttonPressed : styles.buttonNotPressed} 
                name="thumbs-o-up"
                size={20}
                color={'#9B59B6'}
                onPress={() => this.onPressUpvote()}
                />&nbsp;&nbsp; {this.state.upVotes} &nbsp;&nbsp;
              <FontAwesome style={this.state.voted ? styles.buttonPressed : styles.buttonNotPressed}
                name="thumbs-o-down"
                size={20}
                color={'#9B59B6'}
                onPress={() => this.onPressDownvote()}
              />&nbsp;&nbsp; {this.state.downVotes}
              </Text>          
          </Card>

        </View>
      </TouchableOpacity>
      );
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: '#888', marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: '#888', marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
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
    fontSize: 15,
  },
  ratingButtons: {
    flexDirection: 'row',
  },
  buttonPressed: {
    fontWeight : 'bold',
    color: '#03A9F4'
  },
  buttonNotPressed: {
    fontWeight : 'bold',
    color: '#999999'
  },
});
