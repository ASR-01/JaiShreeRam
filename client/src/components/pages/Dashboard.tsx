import axios from 'axios'
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [message, setMessage] = useState()
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('https://api.adityasinghrawat.com/dashboard')
        .then(res => {
            console.log(res)
            if(res.data.success) {
                setMessage(res.data.email)
            } else {
                navigate('/')
            }
        })
        .catch(err => console.log(err))
    })
  return (
    <h2>Dashboard {message}</h2>
  )
}

export default Dashboard