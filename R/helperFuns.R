#helper functions


#' storeInDB a function to help transmit the key/value pairs to the redis server
#' @export
#' @import RCurl
#' @param key the redis key
#' @param value the value to store
storeInDB = function(key, value){
  getURL(paste("http://192.168.15.102:7379/SET/",key,"/",value, sep=""))
}