const xhr = url => {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest;
    request.open('GET', url, true);
    request.onreadystatechange = () => {
      if (request.readyState == 4) {
        resolve(request.responseText);
      }
    }
    request.onerror = error => {
      reject(error);
    }
    request.send(null);
  });
}

export {
  xhr
}