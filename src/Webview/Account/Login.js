import React, { useEffect, useState } from 'react'
import MyInput from '../../Component/MyInput';
import MyButton from '../../Component/MyButton';
import { ApiHit } from '../../utils';
import { buildVersion, login, searchRole } from '../../Constants/Constants';
import { useSelector } from 'react-redux';
import { setAuthenticatedUser, setAuthenticatedUserWithRole, SetBuildVersion } from '../../Storage/Storage';
import { jwtDecode } from 'jwt-decode';

function Login() {

    const ApiReducer = useSelector(state => state.ApiReducer)
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);

    const onClick = () => {
        var json = {
            username: ApiReducer.apiJson.username,
            password: ApiReducer.apiJson.password
        }
        ApiHit(json, login).then(Result => {
            if (Result?.jwtToken) {
                SetBuildVersion(buildVersion);
                setAuthenticatedUser(Result?.jwtToken);
                loadRoleData(Result);
              } else {
                setMsg({ login: 'User Not Found' });
                setLoading(false);
              }
        })
    }

    function loadRoleData(res) {
        let decodedJson = jwtDecode(res?.jwtToken);
        if (decodedJson?.roleId) {
          var json = { page: 1, limit: 1, search: { _id: decodedJson?.roleId } };
          ApiHit(json, searchRole).then((Result) => {
            if (Result?.content?.[0]) {
              Object.assign(res, { roleObject: Result?.content?.[0] });
              setAuthenticatedUserWithRole(res);
              window.location.href = '/';
            } else {
              setLoading(false);
            }
          }).catch(error => {
            console.error('Role search error:', error);
            setLoading(false);
          });
        }
      }

    return (
        <div className='m-20'>
            <div className='mt-10'>
                <MyInput title={'Username'} name={'username'} />
            </div>
            <div className='mt-10'>
                <MyInput title={'Password'} name={'password'} />
            </div>
            <div className='mt-10'>
                <MyButton title={'Submit'} onClick={() => onClick()} />
            </div>
        </div>
    )
}

export default Login;