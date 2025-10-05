const setCookie = (res, tokenType, token, maxAge = 5 * 60 * 1000) => {
  res.cookie(tokenType, token, {
    httpOnly: true,
    secure: true,
    maxAge,
    sameSite: "None", // Change to "None" in production with HTTPS
  });



  /*

// Development cookie settings (non-HTTPS, convenient for local dev)
res.cookie(tokenType, token, {
  httpOnly: true,      // keep cookies inaccessible to JS (still secure)
  secure: false,       // must be false on localhost unless using HTTPS
  sameSite: "Lax",     // Lax is a good default for dev; avoids many cross-site rejections
  maxAge,              // keep as you pass it in
});

//prod
res.cookie(tokenType, token, {
  httpOnly: true,               // not accessible from JS
  secure: true,                 // only send over HTTPS (required when SameSite=None)
  sameSite: "None",             // allow cross-site (frontend on different origin)
  maxAge,                       // expiration in ms (pass in as before)
});



*/ 

};



export default setCookie;



