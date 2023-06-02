//Helper ErrorService function that uses switch
//cases to determine response to output in DOM render
export default class ErrorService {
    static getErrorMessage(errorCode) {
      switch(errorCode) {
        case 400:
          return 'Inappropriate picture found'
        case 403:
          return 'Profanity found in post, please watch your language!';
        case 406:
          return 'Please enter submission!';
        case 200:
          return 'Post uploaded!';
      }
    }
  }