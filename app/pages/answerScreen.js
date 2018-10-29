import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, Avatar } from 'react-native-elements'
import Images from '../Themes/Images';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';

export default class AnswerScreen extends React.Component {
    
  static navigationOptions = {
    headerTitle: 'Answer',
  };

  constructor(props) {
    super(props);
    this.state = {
      profileName: '',
      profileImage : '',
      userID: firebase.auth().currentUser.uid,
      question: '',
      topic : '',
      answer: '',
      totalVotes: 0,
      upVotes : 0,
      downVotes : 0,
      voted : false,
    }
  
  }


    componentWillMount= async() => {

        item = this.props.navigation.state.params.item;
        await this.setState({question : this.props.navigation.state.params.question, topic : this.props.navigation.state.params.topic});
        await this.setState({profileName: item.author, profileImage : item.profileImage, answer : item.answer});

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
    if(this.state.profileImage){
      return(
        <Avatar
          size="large"
          source={{uri : this.state.profileImage}}
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
        return( 
            <View style={styles.container}>
                <View style={{margin : 20}}>
                    <Text style={{fontSize : 30, width : '100%', fontWeight : 'bold', textAlign : 'center'}}>{this.state.question}</Text>
                    <Text style={{fontSize: 12, color : '#888', textAlign : 'center'}}>Topic : {this.state.topic}</Text>
                </View>
                
                <View style={{flexDirection : 'row'}}>
                    {this.imageButton()}
                    <Text style={{fontSize : 15, marginLeft :20, fontWeight : 'bold', lineHeight : 30}}>{this.state.profileName}</Text>
                </View>
                <View style={{marginTop :10}}>
                    {/* <Text style={styles.textStyles}>
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
                    </Text>        */}
                    <Text style={styles.cardText}>
                    {this.state.answer}
                    </Text>                
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding : 20,
      backgroundColor : 'white'
      // alignItems: 'center',
    },

    textStyles: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    buttonPressed: {
    color: '#999999'
    },
    buttonNotPressed: {
    color: '#9B59B6'
    },
});