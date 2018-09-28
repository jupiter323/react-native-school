import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
  modalContainer: {
    alignItems: 'stretch',
    padding: 15,
    borderWidth: 1.5,
    borderRadius: 15,
    borderColor: '#5A3DC9',
    borderTopWidth: 25,
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowColor: '#5A3DC9',
  },
  modalTitle: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: 'bold',
  },
  defaultTextInput: {
    alignItems: 'center',
    minWidth: 200,
    height: 40,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5A3DC9',
    backgroundColor: 'white',
  },
  btn: {
    alignItems: 'center',
    height: 40,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#5A3DC9',
  },
  btnText: {
    color: 'white',
  },
})