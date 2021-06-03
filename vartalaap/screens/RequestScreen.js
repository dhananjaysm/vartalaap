import React from 'react' ;
import { useState ,useEffect,useCallback,useRef} from 'react';

import {View,Text,TextInput,StyleSheet , Button,FlatList,TouchableOpacity,ActivityIndicator,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import {CHAT_SCREEN,FETCH_SCREEN,FRIEND_SCREEN} from '../components/routeNames';
import userData from '../assets/userData'
import firebase from 'firebase';
import {config} from '../firebaseConfig'
import _, { map,pluck } from 'underscore';

const RequestScreen=({route,navigation})=>{

const fsDetails= route.params; //This needs to be passed to chats screen
//console.log(fsDetails);
const {navigate} = useNavigation();
const [blogs,setBlogs]=useState([]);
const [friend,setFriend] = useState([]);
const [requests,setRequests] = useState([]);
const currentUser = fsDetails.userDetails.username;
const currentUserId = fsDetails.userDetails.userid;
const [isRequested,setIsRequested] = useState (false)

const database = firebase.firestore();
const fetchBlogs=(done)=>{
     let data=[]
     var dbref = database.collection('requests').doc("PendingRequests").collection(currentUserId.toString())
    // 
      var query= dbref.where("receiverName", "==", currentUser).onSnapshot((querySnapShot)=>{
                querySnapShot.forEach((doc)=>{
                 data.push({
                   sendername: doc.data().senderName,
                   senderId:doc.data().senderId});
                  setIsRequested(true)
                 });
                 console.log("req sent by ",data)
              setRequests(data)
             
      });
}
 useEffect(() => {
    fetchBlogs();
  }, [])

const acceptRequest=async(sendername,senderId)=>{

var dbref1 = database.collection('friends').doc(senderId.toString()).collection(sendername)
var addFriend1 = await dbref1.add({
    friendName:currentUser,
    friendID:currentUserId
  });

var dbref2 = await database.collection('friends').doc(currentUserId.toString()).collection(currentUser)
var addFriend2 = dbref2.add({
    friendName:sendername,
    friendID:senderId
  });
deleteRequest(sendername,senderId)
navigate(FRIEND_SCREEN);
}
const deleteRequest=async(sendername,senderId)=>{
console.log(senderId)
  var dbref3 = database.collection('requests').doc("PendingRequests").collection(currentUserId.toString())
var reject_query = dbref3.where('senderName','==',sendername);
 await  reject_query.get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    doc.ref.delete();
        
  });
 navigate(FRIEND_SCREEN)
});

}

const renderFriendsList=({item})=>{


  return (
   
    <View style={styles.friendWrapper}>
    <Text style={{fontSize:20, marginLeft:10, alignSelf:"center"}}> {item.sendername} </Text> 
      <View style={{alignItems:'center', marginLeft:70, flexDirection:'row'}}>
         <Button title="accept" onPress={()=>acceptRequest(item.sendername,item.senderId)} /> 
         <Button title="reject" onPress={()=>deleteRequest(item.sendername,item.senderId)} /> 

       </View>
    </View>
    
    
  )

}



  
return (

  
    <View style={styles.wrapper}>
      
  {isRequested?   
    <FlatList
    data= {requests}
    keyExtractor={item => `${item.userid2}`} 
    renderItem={renderFriendsList} />
   : <View style={styles.noRequest}>
   <Text style={{fontSize:24, color:"#D3D3D3"}}> No pending requests </Text>
   </View>
  }

    
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
  flexDirection:'row'
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
noRequest:{
 alignSelf:"center",
 marginTop:"50%"
}

})
export default RequestScreen;