import React from 'react' ;
import {View,Text,TextInput,StyleSheet , Button,FlatList,ActivityIndicator,ScrollView,Keyboard ,TouchableOpacity ,KeyboardAvoidingView,Platform} from 'react-native';
import { useNavigationParam } from '@react-navigation/native';
import userData from '../assets/userData'
import moment from 'moment';
import 'moment-timezone';
import firebase from 'firebase';
import {config} from '../firebaseConfig'
import { useState ,useEffect,useCallback,useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import Chat from '../components/Chat'

const ChatScreen=({route,navigation})=>{
  const [chat, setChat] = useState('');
  const [chatItems, setChatItems] = useState([]);
  const userDetails= route.params;
  const currentUser = userDetails.currentUser;
  const currentUserId = userDetails.currentUserId
  const friendname = userDetails.friendname;
  const friendId = userDetails.friendId
  const chatId = String(currentUserId*friendId)
  //console.log(chatId)
const database = firebase.firestore();
let listRef = useRef(null)

  const fetchChats=async()=>{
     let data=[]
    var dbref = database.collection('chats')
    var docRef1 = dbref.doc("Chats").collection(chatId).orderBy("createdAt", "asc");
     var query1= await docRef1.get().then((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              data.push(change.doc.data())
                               
            }
            if (change.type === "modified") {
                console.log("Modified chat: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed chat: ", change.doc.data());
            }
     
    })
          //
                
    
     });
     console.log(data)
    setChatItems(data)
                    
                                    
}
   useEffect(() => {
    fetchChats();
  }, [])

  const handleAddMsg = () => {
  if(!chat.length==0){
   //Keyboard.dismiss();
   //setChatItems([...chatItems,{text:chat, sender:currentUser , receiver:friendname}])
   fetchChats();
   setChat(null);
    var dbref3= database.collection('chats').doc("Chats").collection(chatId)
    var addrequest = dbref3.add({
    receiver: friendname,
    sender: currentUser,
    text:chat,
    createdAt: Date.now()
  });
  } else {
    Keyboard.dismiss();
  }
  }

  return (
    <View style={styles.container}>
 
      <FlatList 
      
      data= {chatItems}
      ref={listRef}
      onContentSizeChange={() => listRef.current.scrollToEnd() }
      onLayout={() => listRef.current.scrollToEnd() }
      keyExtractor={(item,index)=>index}
      renderItem={({item})=>{

        console.log({item})
        return (
        <TouchableOpacity   >
                  <Chat text={item.text} sender={item.sender} currentuser={currentUser} createdAt={item.createdAt}/> 
                </TouchableOpacity>
        )
      }
      } 

      />

      {/* Write a chat */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeMsgWrapper}
        keyboardVerticalOffset={Platform.OS === "ios" ? 83: 0}
      >
        <TextInput style={styles.input} placeholder={'Write a message'} value={chat} onChangeText={text => setChat(text)} />
        <TouchableOpacity onPress={() => handleAddMsg()}>
          <View style={styles.sendWrapper}>
            <Text style={styles.sendText}>Send</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
   
  },
  chatsWrapper: {
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  items: {
    marginTop: 20,
  },
  writeMsgWrapper: {
   
    marginBottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  sendWrapper: {
    width: 80,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  sendText: {},
});


export default ChatScreen;