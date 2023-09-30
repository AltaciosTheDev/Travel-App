import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import{ getDatabase, push, onValue, remove, ref } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js" 

//SETUP VARIABLES TO COMMUNICATE WITH THE DATABASE
//1. store the database URL in a var
const appSettings = {
    databaseURL: "https://realtime-database-5c348-default-rtdb.firebaseio.com/"
}
//2. initialize the app in the previous url from our database and stor in a var
const app = initializeApp(appSettings)
//3. from the initialized app, get the database and store in a var
const database = getDatabase(app)
//4. create a reference in the retrieved database and stor in a var 
const shoppingListinDB = ref(database, "shoppingList")

//SETUP VARIABLES TO COMMUNICATE WITH THE DOM 
const inputFieldEl = document.getElementById("input-field-el")
const addButtonEl = document.getElementById("button-el")
const shoppingListEl = document.getElementById("shopping-list-el")

//Create event Listener for Add to cart button to store a value in the database
addButtonEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value
    if(inputValue){
        push(shoppingListinDB, inputValue)
        clearInputFieldEl()
    }
    else{
        
    }
})

//CREATE FUNCTION FOR RETRIEVING DATA WIHT ONVALUE 
//1. onValue will give us a snapshot everytime the info in the database changes
onValue(shoppingListinDB, function(snapshot){
    //First thing ever with retreiving data, checking if the data exists 
    if(snapshot.exists()){
        //convert values from snapshot to an array 
        let itemsArray = Object.entries(snapshot.val())
        
        //But before for loop, let's clear the dom first to avoid duplicates
        clearShoppingListEl()
        //After array always comes the loop
        for(let i=0;i<itemsArray.length;i++){
            let currentItem = itemsArray[i]
            appendItemToShoppingListEl(currentItem)
        }
        //hacer 
    }
    else{
        shoppingListEl.textContent = "Nothing added yet..." 
    }
    
})


//Define clear input value element value function 
function clearInputFieldEl(){
    inputFieldEl.value = ""
}

//Define function to clear the DOM elements to avoid duplicates
function clearShoppingListEl(){
    //Gotta use innerHTML b/c we need to also clear the tags 
    shoppingListEl.innerHTML = ""
}


//Define append to shopping list el function 
function appendItemToShoppingListEl(itemToAppend){
     let itemID = itemToAppend[0]
     let itemValue = itemToAppend[1]
     let listEl = document.createElement("li")
     listEl.textContent = itemValue
     shoppingListEl.append(listEl)
     
     listEl.addEventListener("click", function(){
         let exactLocationOfItemWithIDinDB = ref(database, `shoppingList/${itemID}`)
         remove(exactLocationOfItemWithIDinDB)
     })
}

