// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCY4b1-Dmz1EaBoUbB7ID-QfCBsmQS7Z6s",
    authDomain: "tracker-2031c.firebaseapp.com",
    projectId: "tracker-2031c",
    storageBucket: "tracker-2031c.firebasestorage.app",
    messagingSenderId: "987453402915",
    appId: "1:987453402915:web:2c498210aee1d9fa512696",
    measurementId: "G-S7B3VVXJ8F"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Allowed Location (Center coordinates and radius in meters)
  const ALLOWED_LOCATION = { lat: 37.7749, lng: -122.4194 }; // Example: San Francisco
  const ALLOWED_RADIUS = 1000; // 1 km
  
  // Haversine formula to calculate distance
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in meters
  }
  
  // Check if user is within allowed location
  function isWithinAllowedLocation(userLat, userLng) {
    const distance = calculateDistance(userLat, userLng, ALLOWED_LOCATION.lat, ALLOWED_LOCATION.lng);
    return distance <= ALLOWED_RADIUS;
  }
  
  // Get user location and validate access
  function validateLocationAccess() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          if (isWithinAllowedLocation(latitude, longitude)) {
            resolve(true);
          } else {
            reject("Access denied. You are outside the allowed location.");
          }
        }, () => reject("Geolocation access denied."));
      } else {
        reject("Geolocation is not supported by your browser.");
      }
    });
  }
  
  // Sign Up
  document.getElementById('signUp').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const accessGranted = await validateLocationAccess();
      if (accessGranted) {
        await auth.createUserWithEmailAndPassword(email, password);
        document.getElementById('message').innerText = "Sign-up successful!";
      }
    } catch (error) {
      document.getElementById('message').innerText = error;
    }
  });
  
  // Log In
  document.getElementById('login').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      const accessGranted = await validateLocationAccess();
      if (accessGranted) {
        await auth.signInWithEmailAndPassword(email, password);
        document.getElementById('message').innerText = "Login successful!";
      }
    } catch (error) {
      document.getElementById('message').innerText = error.message || error;
    }
  });
  