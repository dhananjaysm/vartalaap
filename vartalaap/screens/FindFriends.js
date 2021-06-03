import React from 'react' ;
import { useState ,useEffect,useCallback,useRef} from 'react';

import {View,Text,TextInput,StyleSheet , Button,FlatList,TouchableOpacity,ActivityIndicator,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import {CHAT_SCREEN,FETCH_SCREEN} from '../components/routeNames';
import userData from '../assets/userData'
import firebase from 'firebase';
import {config} from '../firebaseConfig'
import _, { map,pluck } from 'underscore';

const FindFriends=({route,navigation})=>{

const [potentialFriend,setPotentialFriend] = useState([]);
const [term ,setTerm] = useState('');
const fsDetails= route.params; //This needs to be passed to chats screen

const {navigate} = useNavigation();
const [chat,setChat] =useState([]);

const [isSending, setIsSending] = useState(false)
const [blogs,setBlogs]=useState([]);

const database = firebase.firestore();
const currentUser = fsDetails.userDetails.username;
const currentUserId = fsDetails.userDetails.userid;
console.log(currentUser)
console.log(currentUserId)

  
   const fetchBlogs=(done)=>{
     let userdata=[]
     var dbref = database.collection('users').where("username", "!=", currentUser)
     var query= dbref.onSnapshot((querySnapShot)=>{
                querySnapShot.forEach((doc)=>{
                 userdata.push({
                   userid:doc.data().userid,
                   username: doc.data().username});
                 
                 });
               // console.log(userdata)
                setPotentialFriend(userdata)
                
                   });
              
   }

  
   useEffect(() => {
    fetchBlogs();
  }, [])

 
const sendFriendRequest=(requestName)=>{
  console.log(requestName)
let friendid ;
for (var i=0;i<potentialFriend.length;i++ ){
  if (potentialFriend.[i].username == requestName){
    friendid=potentialFriend.[i].userid
    //SEND REQUEST
    //PATH we want is requests/receiverid/senderid
    var dbref2 = database.collection('requests').doc("PendingRequests").collection(friendid.toString())
    var addrequest = dbref2.add({
    receiverName: requestName,
    senderName: currentUser,
    senderId:currentUserId,
  });
  Alert.alert("Request Sent to",requestName)
  //return potentialFriend.splice(i,1)
  } 
}

//navigate(FRIEND_SCREEN);
}

const renderFriendsList=({item})=>{


  return (
   <View style={styles.friendWrapper}>
   
    <Text style={{fontSize:20, marginLeft:10, alignSelf:"center" , flex:2}}> {item.username} </Text> 
   
    <View style={{alignItems:'center', flexDirection:'row' , flex:1 }}>
         <Button title="Send request" onPress={()=>sendFriendRequest(item.username)} /> 

    </View>
    </View>
    
  )

}



  
return (

  
    <View style={styles.wrapper}>
      
  
    <FlatList
    data= {potentialFriend}
    keyExtractor={item => `${item.userid}`} 
    renderItem={renderFriendsList} />
    
  
    </View>

    
  )
}

const styles =StyleSheet.create ({
wrapper:{
  flex:1,
  backgroundColor:'white',

},
friendWrapper:{
  borderWidth:1,
  borderRadius:4,
  height:50,
  flexDirection:'row',
  marginTop:5
},
iconStyle:{
  fontSize:30,
  alignSelf:'center',
   marginHorizontal:15,
},
inputStyle:{
  borderColor:'black',
  borderWidth:1,
  borderRadius:5,
  backgroundColor:'#F0EEEE',
  width:150,
  marginTop:10,
  fontSize:18, 
  alignSelf:'center',
  padding:10
},

})
export default FindFriends;