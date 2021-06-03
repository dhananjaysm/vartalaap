import React,{useState,useEffect,useCallback} from 'react' ;
import { useNavigation } from '@react-navigation/native';
import {View,Text,TextInput,StyleSheet , Button,Alert} from 'react-native';
import {FRIEND_SCREEN,FETCH_SCREEN} from '../components/routeNames';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase';

const LoginScreen=()=>{
  //
    const {navigate}= useNavigation();
    const [userInput,setUserInput]= useState('');
    const [inputIsvalid,setInputIsValid]= useState(true)
    const [inputContainsSpecial,setInputContainsSpecial]= useState(false)
    const [isAlreadyRegistered,setIsAlreadyRegistered] = useState(false)
    const database = firebase.firestore();
    const data=[]

    const fetchUsers=async(currentUser)=>{
    
     var dbref = database.collection('users')
    var docRef = dbref.where("username", "==", currentUser);
//console.log(currentUser)
    var query= await docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             console.log(doc.id, " => ", doc.data());
             data.push({
            username:doc.data().username,
            userid:doc.data().userid})
        });       
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    })

  return data;
               
   }

const  registerUser= async() => {
 
  if(!userInput.length==0){
  var registeredUser =[]
  var dbref = database.collection('users')
 var docRef = dbref.where("username", "==", userInput);
var query= await docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             //console.log(doc.id, " => ", doc.data());
             registeredUser.push({
            username:doc.data().username,
            userid:doc.data().userid})
            
        });       
    })
 

if(registeredUser.length==0) {
var newUserId = Math.floor(Math.random() * 10000) + 1;
 var adduser = await database.collection('users').add({
    username: userInput,
    userid:newUserId
  
  });
Alert.alert("Welcome to Vartalaap")
} else {
  Alert.alert("Already Registered")
}

  }


else {
  Alert.alert("Please choose a name??")
}
};
 

  const authUser=async()=>{
    console.log(userInput)
   if(setInputIsValid) { 
    await fetchUsers(userInput);
    if(data.length == 0  ){
     Alert.alert("User is not registered")

     } else if (data.[0].username==userInput) {
       const username = data.[0].username
       const userid = data.[0].userid
        navigate(FRIEND_SCREEN,{username,userid})
   } 
   
     }
  }




const onChangeHandler = (text)=>{
  if(text.trim().length===0) {
    setInputIsValid(false)
  }else {
   var regex = /^[A-Za-z0-9 ]+$/
    //Validate TextBox value against the Regex.
    var isValid = regex.test(text);
        if (!isValid) {
            setInputContainsSpecial(true)
        } else {
            setInputContainsSpecial(false)
        }
    setInputIsValid(true)
  }
 setUserInput(text)
}


  return (
    <View style={styles.wrapper}> 
    <View style={styles.inputContainer}>
    <Text style={styles.textStyle}> Enter Your Name  </Text>
    <TextInput  style={styles.inputStyle}
   
    autoCorrect="false"
    autoFocus="false"
    importantForAutofill="no"
    maxLength="20"
    onChangeText={ onChangeHandler  }
    //onEndEditing={()=>handleOnEndEditing() }
    
               />
               {!inputIsvalid && <Text style={styles.errorMessage}> Please Enter A valid name </Text>}
               {inputContainsSpecial && <Text style={styles.errorMessage} > Special Characters Not Allowed </Text>}
        <View style={{flexDirection:'row', marginTop:10, justifyContent:"space-between" ,}}>
        <Button title="Login" onPress={()=>authUser()} />
        <Button title="Register" onPress={()=>registerUser()} />
        </View>

    </View>
    </View>
  )
}

const styles =StyleSheet.create ({
wrapper:{
  alignItems:'center',
  justifyContent:'center',
  flex:1,
  backgroundColor:'white',
    
  
},
inputContainer:{
position:"absolute",
bottom:"60%",



},
textStyle:{
fontSize:20,
},
inputStyle:{
  borderColor:'black',
  borderWidth:1,
  borderRadius:5,
  backgroundColor:'#F0EEEE',
  width:170,
  marginTop:10,
  fontSize:18, 
  paddingVertical:5
},
errorMessage :{
  color:'red',
  marginTop:5,
  fontSize:14
}

})
export default LoginScreen;