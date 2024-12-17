
export const ApiHit = (json, url) => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
        body: JSON.stringify(json)
      };
    
      fetch(url, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            resolve(result)
          },
          (error) => {
    
          }
        
        )
    }
    );
  }