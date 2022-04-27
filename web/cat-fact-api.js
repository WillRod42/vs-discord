import XMLHttpRequest from "xhr2";

export default class CatFact {
  static getFact() {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest;
      const url = `https://catfact.ninja/fact`;
      request.onload = function () {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(request.response);
        }
      };
      request.open("GET", url, true);
      request.send();
    });
  }
}