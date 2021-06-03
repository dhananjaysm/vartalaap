import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
const Chat = (props) => {

  const senderCheck=()=>{
    return props.sender==props.currentuser
  }
  return (
    <View style={{marginLeft:senderCheck()? 50:0, marginRight:senderCheck()?0:50  ,alignItems:senderCheck()?'flex-end':'flex-start'}}>
   
   <Text style={{fontSize:12}}> {props.sender}</Text>
    <View style={[styles.item,{ backgroundColor: senderCheck() ? '#55BCF6':'green'}]}>
       <View style={styles.itemLeft}>
       <Text style={styles.itemText}>{props.text}</Text>
       <Text style={styles.createdAt}>{moment(props.createdAt).fromNow()}</Text>

      </View>
      </View>
   
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
   
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width:"50%"
  },
  itemLeft: {
    flex:1,
    
  },
  
  itemText: {
    maxWidth: '80%',
    fontSize:16,
    fontWeight:'bold'
    
  },
  createdAt :{
    fontSize:10
  }
 
});

export default Chat;