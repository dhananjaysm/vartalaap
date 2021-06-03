import React from 'react' ;
import { useState ,useEffect,useCallback,useRef} from 'react';

import {View,Text,TextInput,StyleSheet , Button,FlatList,TouchableOpacity,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import {CHAT_SCREEN,FIND_FRIENDS,REQUEST_SCREEN} from '../components/routeNames';
import userData from '../assets/userData'
import firebase from 'firebase';
import {config} from '../firebaseConfig'
import _, { map,pluck } from 'underscore';

const FriendScreen=({route,navigation})=>{

  
const [friend,setFriend] = useState([]);
const [term ,setTerm] = useState('');
const userDetails= route.params; //This needs to be passed to chats screen
console.log(userDetails);
const {navigate} = useNavigation();

const [blogs,setBlogs]=useState([]);

const database = firebase.firestore();
const currentUser = userDetails.username;
const currentUserId = userDetails.userid;
const [doesFriendExist,setDoesFriendExist] = useState(false)
  
const fetchBlogs=async(done)=>{
     let data=[]
     var dbref = database.collection('friends').doc(currentUserId.toString()).collection(currentUser)
     var query= await dbref.onSnapshot((querySnapShot)=>{
                querySnapShot.forEach((doc)=>{
                 data.push({
                   friendname: doc.data().friendName,
                   friendId: doc.data().friendID});
                   setDoesFriendExist(true)
                 });
                console.log(data)
                setFriend(data)
          
                   });
              
}
   useEffect(() => {
    fetchBlogs();
  }, [])



const findFriends=()=>{
navigate(FIND_FRIENDS,{friend,userDetails})
}
const requestFriend=()=>{
navigate(REQUEST_SCREEN,{friend,userDetails})
}

const sendToChat=(friendname,friendId)=>{
  navigate(CHAT_SCREEN,{friendname,friendId,currentUser,currentUserId})

}

const renderFriendsList=({item})=>{


  return (
    <TouchableOpacity style={{
                        padding: 2,
                        paddingBottom: 2,
                        backgroundColor: 'white',
                        borderRadius: 4,                     
                        marginRight: 2,
                      
                    }}
                    onPress={()=>sendToChat(item.friendname,item.friendId)}
       >
    <View style={styles.friendWrapper}>
            <Icon name = "user-circle" style={styles.iconStyle} />
    <Text style={{fontSize:20, marginLeft:10, alignSelf:"center"}}> {item.friendname} </Text> 

    </View>
    </TouchableOpacity>
  )

}



  
return (

  
    <View style={styles.wrapper}>
 
   <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
       <Button title="Find Friends"  onPress={()=>findFriends()}/>
         <Button title="Requests"  onPress={()=>requestFriend()}/>
      </View>
        
    {doesFriendExist ?  
    <FlatList
    data= {friend}
    keyExtractor={item => `${item.userid2}`} 
    renderItem={renderFriendsList} />
    
   
    : <View style={styles.noFriend}>
   <Text style={{fontSize:24, color:"#D3D3D3"}}> No Friends ? Go find some  </Text>
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
noFriend:{
 alignSelf:"center",
 marginTop:"50%"
}
})
export default FriendScreen;