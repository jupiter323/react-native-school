import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';
import { NavigationActions } from 'react-navigation';


/*
  Displays a Jedi ID Card

  start at
  load more
*/
export default class SelectConsultant extends React.Component {

  static navigationOptions = {
    headerTitle: 'Select Consultant',
  };

  constructor(props){
    super(props);
    this.state = {
      price: '',
      name: '',
      description: '',
      item: '',
      sellerID: '',
      convoKey: '',
      sellerName: '',
      // userID: firebase.auth().currentUser.uid,
      previousMessage: false,
      image: '',
      bio: '',
      hometown: '',
      experience: '',
      specialties: [],
      specialtiesArray: [],
      affiliation: '',
    }
    //See what props our StarWarsCard renders with
    console.log("SelectConsultant props " + JSON.stringify(props));
  }

  componentDidMount() {
    this.setState({price: this.props.navigation.state.params.item.price, name: this.props.navigation.state.params.item.name,
    item: this.props.navigation.state.params.item, description: this.props.navigation.state.params.item.description, sellerName: this.props.navigation.state.params.item.seller,
    image: this.props.navigation.state.params.item.profilePicture, bio: this.props.navigation.state.params.item.bio,
    hometown: this.props.navigation.state.params.item.cityState, experience: this.props.navigation.state.params.item.years,
    affiliation: this.props.navigation.state.params.item.schoolName, specialties: this.props.navigation.state.params.item.specialties});
    //
    // console.log("item props: " + JSON.stringify( this.props.navigation.state.params.item));
    // console.log("item props specialties: " + JSON.stringify( this.props.navigation.state.params.item.specialties));
    // var arraySpecialties = this.state.specialtiesArray;
    // console.log("type specialties " + typeof this.state.specialties);
    // console.log(" specialties " + this.state.specialties);
    //
    // this.props.navigation.state.params.item.specialties.forEach(function(element) {
    //   console.log(element.value);
    //   arraySpecialties.push(element.value + ", ");
    // });
    // console.log(this.state.specialtiesArray);
    // this.setState( {specialtiesArray: arraySpecialties});
    // this.setState({description: this.props.navigation.state.params.description})
  }


  bookAppointment= async (item) => {
    this.props.navigation.navigate('CalendarOtherScreen', {item: item});
  }

  render() {

    return (
        <View style={styles.container}>

          <Card style={styles.card}
              title={this.state.name}
              image={{uri: this.state.image}}
              imageProps={{ resizeMode: 'contain'}}>
              <Text style={styles.textStyles}>
              Hometown: {this.state.hometown}
              </Text>
              <Text style={styles.textStyles}>
              Affiliation: {this.state.affiliation}
              </Text>
              <Text style={styles.textStyles}>
              Price: ${this.state.price}
              </Text>
              <Text style={styles.textStyles}>
              Bio: {this.state.bio}
              </Text>
              <Text style={styles.textStyles}>
              Experience: {this.state.experience} years
              </Text>
              <Text style={styles.textStyles}>
              Specialties: {this.state.specialtiesArray}
              </Text>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                onPress={() => this.bookAppointment()}
                title='Book Appointment' />
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                onPress={() => this.onPressMessageSeller()}
                title='Message Consultant' />
              </Card>

        </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
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
});
