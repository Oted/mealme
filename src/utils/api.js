import {Observable} from 'rxjs';

export function login(email, password) {
  return Observable.fromPromise(
    fetch('http://localhost:8000/api/login', {method: "POST",body: JSON.stringify({email, password})}).then(res => {
      if (!res.ok) {
        throw new Error('Wrong password or username, please try again.');
      }

      return res.json();
    })
  ).catch(err => {
    return Observable.of(err.message);
  })
}

export function register(type, newUser) {
  return Observable.fromPromise(
    fetch('http://localhost:8000/api/register' + type, {method: "POST",body: JSON.stringify(newUser)}).then(res => {
      if (!res.ok) {
        throw new Error(res.status === 422 ? 'User already exists.' : 'Woops something went wrong :/');
      }

      return res.json();
    })
  ).catch(err => {
    return Observable.of(err.message);
  })
}

export function logout(token) {
  return Observable.fromPromise(
    fetch('http://localhost:8000/api/logout', {method: "POST", headers : {"Authorization" : token}}).then(res => {
      if (!res.ok) {
        throw new Error('Could not log out.');
      }

      return res.json();
    })
  ).catch(err => {
    return Observable.of(err.message);
  })
}

export function refresh(token) {
  return Observable.fromPromise(
    fetch('http://localhost:8000/api/refresh', {method: "POST", headers : {"Authorization" : token}}).then(res => {
      if (!res.ok) {
        throw new Error('Could not refresh');
      }

      return res.json();
    })
  )
  .catch(err => {
    return Observable.of(err.message);
  })
}
