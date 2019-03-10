var config = {
  apiKey: "AIzaSyD_GIkF1m7zpc9iTWFNbB-V9ZDiZwIgZHU",
  authDomain: "tracking-a1f24.firebaseapp.com",
  databaseURL: "https://tracking-a1f24.firebaseio.com",
  projectId: "tracking-a1f24",
  storageBucket: "tracking-a1f24.appspot.com",
  messagingSenderId: "686237313762"
};
var db = firebase.initializeApp(config).database();
var { LMap, LTileLayer, LMarker } = Vue2Leaflet;
var userRefs = db.ref('users')
new Vue({
  el: '#app',
  components: { LMap, LTileLayer, LMarker },
  data() {
    return {
      myUuid : localStorage.getItem('myUuid'),
      zoom:13,
      center: L.latLng(3.5289336, -76.2966477),
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(3.5289336, -76.2966477),
      watchPositionId : null
    }
  },
  mounted(){
    var vm = this
    if (!vm.myUuid) {
      vm.myUuid = vm.guid();
      localStorage.setItem('myUuid', vm.myUuid);
    }else{
      
      vm.watchPositionId = navigator.geolocation.watchPosition(vm.successCoords, vm.errorCoords);
      
    }
    
    
    
  },
  firebase: {
    users: userRefs.limitToLast(25)
  },
  methods:{
    successCoords(position) {
    var vm = this
    if (!position.coords) return
      
      userRefs.child(vm.myUuid).set({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        timestamp: Math.floor(Date.now() / 1000)
      })
      vm.center = L.latLng([position.coords.latitude, position.coords.longitude])
      vm.marker = L.latLng([position.coords.latitude, position.coords.longitude])
    },
    errorCoords() {
      console.log('Unable to get current position')
    },
    formatLocation(lat, lng){
      return L.latLng(lat, lng)
    },
    guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  }
});